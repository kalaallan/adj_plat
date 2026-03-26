package com.example.plat_back.websocket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.stereotype.Component;

import com.example.plat_back.models.Etudiant;
import com.example.plat_back.models.Examen;
import com.example.plat_back.models.Langage;
import com.example.plat_back.repository.EtudiantRepository;
import com.example.plat_back.repository.ExamenRepository;
import com.example.plat_back.repository.LangageRepository;
import com.example.plat_back.service.BeanUtil;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/ws/terminal/{examId}/{studentId}/{langageId}")
@Component
public class TerminalWebSocket {

    private Process process;
    private Session session;
    private Path studentDir;
    private Langage langage;
    private final String BASE_DIR = "D:/uploads/";
    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("examId") String examId,
                       @PathParam("studentId") String studentId,
                       @PathParam("langageId") String langageId) {
        this.session = session;
        session.setMaxIdleTimeout(300000);

        try {
            // Récupération directe des ressources
            ExamenRepository examRepo = BeanUtil.getBean(ExamenRepository.class);
            EtudiantRepository studentRepo = BeanUtil.getBean(EtudiantRepository.class);
            LangageRepository langRepo = BeanUtil.getBean(LangageRepository.class);

            this.langage = langRepo.findById(langageId).orElseThrow();
            Examen exam = examRepo.findByIdWithDetails(examId).orElseThrow();
            Etudiant student = studentRepo.findById(studentId).orElseThrow();

            // Setup du dossier de travail
            String safePath = sanitize(exam.getNom()) + "/" + sanitize(student.getNom() + "_" + student.getPrenom());
            this.studentDir = Paths.get(BASE_DIR, safePath);
            Files.createDirectories(studentDir);

            sendToClient("Connecté.\n");
        } catch (IOException | RuntimeException e) {
            sendToClient("Erreur initialisation: " + e.getMessage());
        }
    }

    @OnMessage
    public void onMessage(String message) throws IOException {
        // Redirection vers STDIN si le process tourne
        if (process != null && process.isAlive()) {
            OutputStream os = process.getOutputStream();
            os.write((message + "\n").getBytes());
            os.flush();
            return;
        }
        executeCode(message);
    }

    private void executeCode(String sourceCode) {
        if (isRunning.getAndSet(true)) return;

        try {
            // Préparation fichier
            if (langage.getExtension().equalsIgnoreCase(".java")) {
                sourceCode = sourceCode.replaceAll("package\\s+[a-zA-Z0-9.]+;", "");
            }
            String fileName = "Main" + langage.getExtension();
            Files.writeString(studentDir.resolve(fileName), sourceCode);

            // Conversion chemin pour Docker (Windows -> Linux style)
            String dockerPath = studentDir.toAbsolutePath().toString().replace("\\", "/");
            if (dockerPath.contains(":")) {
                dockerPath = "/" + dockerPath.substring(0, 1).toLowerCase() + dockerPath.substring(2);
            }

            ProcessBuilder pb = new ProcessBuilder(
                "docker", "run", "--rm", "-i", "--network=none", "--memory", "128m",
                "-v", dockerPath + ":/code", "-w", "/code",
                langage.getImage_docker(), "sh", "-c", buildCommand(fileName)
            );

            pb.redirectErrorStream(true);
            process = pb.start();

            // Thread de lecture simplifié
            new Thread(this::readProcessOutput).start();

        } catch (IOException | RuntimeException e) {
            isRunning.set(false);
            sendToClient("Erreur: " + e.getMessage());
        }
    }

    private void readProcessOutput() {
        try (InputStream in = process.getInputStream()) {
            byte[] buffer = new byte[1024];
            int n;
            while ((n = in.read(buffer)) != -1) {
                sendToClient(new String(buffer, 0, n, java.nio.charset.StandardCharsets.UTF_8));
            }
        } catch (IOException | RuntimeException e) {
        } finally {
            isRunning.set(false);
            sendToClient("\n[Terminé]\n");
        }
    }

    private synchronized void sendToClient(String text) {
        try {
            if (session != null && session.isOpen()) {
                session.getBasicRemote().sendText(text);
            }
        } catch (IOException | RuntimeException e) {}
    }

    @OnClose
    public void onClose() {
        if (process != null) process.destroyForcibly();
    }

    @OnError
    public void onError(Session s, Throwable t) {
        // Plus besoin de logs complexes ici si le front gère bien la fermeture
    }

    private String sanitize(String s) {
        return s.trim().replaceAll("[^a-zA-Z0-9]", "_");
    }

    private String buildCommand(String fileName) {
        String run = langage.getRun_cmd().replace("{filename}", fileName);
        String compile = langage.getCompile_cmd();
        if (compile == null || compile.isBlank()) return run;
        return compile.replace("{filename}", fileName) + " && " + run;
    }
}