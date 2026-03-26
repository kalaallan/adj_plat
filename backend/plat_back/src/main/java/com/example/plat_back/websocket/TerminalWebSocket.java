package com.example.plat_back.websocket;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Component;

import com.example.plat_back.models.Etudiant;
import com.example.plat_back.models.Examen;
import com.example.plat_back.models.Langage;
import com.example.plat_back.repository.EtudiantRepository;
import com.example.plat_back.repository.ExamenRepository;
import com.example.plat_back.repository.LangageRepository;
import com.example.plat_back.service.BeanUtil;

import jakarta.websocket.OnClose;
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
    private final String BASE_DIR = "D:/uploads/";

    private ExamenRepository examRepository;
    private EtudiantRepository studentRepository;
    private LangageRepository langageRepository;

    private String sanitize(String input) {
        return input.trim().replaceAll("[^a-zA-Z0-9]", "_");
    }

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("examId") String examId,
                       @PathParam("studentId") String studentId,
                       @PathParam("langageId") String langageId) throws IOException {

        this.session = session;

        // Récupération des Beans via BeanUtil
        this.examRepository = BeanUtil.getBean(ExamenRepository.class);
        this.studentRepository = BeanUtil.getBean(EtudiantRepository.class);
        this.langageRepository = BeanUtil.getBean(LangageRepository.class);

        // Récupération des infos en Base
        Examen exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Examen introuvable"));
        Etudiant student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        Langage langage = langageRepository.findById(langageId)
                .orElseThrow(() -> new RuntimeException("Langage introuvable"));

        // Chemins sécurisés
        String safeExam = sanitize(exam.getNom());
        String safeStudent = sanitize(student.getNom() + "_" + student.getPrenom());
        Path studentDir = Paths.get(BASE_DIR, safeExam, safeStudent);
        Files.createDirectories(studentDir);

        // Vérification du fichier selon l'extension du langage
        String fileName = "Main" + langage.getExtension(); // ex: Main.java
        Path codeFile = studentDir.resolve(fileName);
        
        if (!Files.exists(codeFile)) {
            this.session.getBasicRemote().sendText("Erreur : Fichier " + fileName + " introuvable.\n");
            return;
        }

        // Préparation Docker (Format Windows)
        String absolutePath = studentDir.toAbsolutePath().toString().replace("\\", "/");
        if (absolutePath.contains(":")) {
            absolutePath = "/" + absolutePath.substring(0, 1).toLowerCase() + absolutePath.substring(2);
        }

        // Construction de la commande (Compilation && Exécution)
        String compileCmd = langage.getCompile_cmd() != null ? langage.getCompile_cmd().replace("{filename}", fileName) : "";
        String runCmd = langage.getRun_cmd().replace("{filename}", fileName);
        if (langage.getNom().equalsIgnoreCase("Java")) runCmd = "java Main";
        
        String fullCmd = !compileCmd.isEmpty() ? compileCmd + " && " + runCmd : runCmd;

        // Lancement Docker avec l'image et la commande de la DB
        ProcessBuilder pb = new ProcessBuilder(
            "docker", "run", "--rm", "-i",
            "--network=none",
            "-v", absolutePath + ":/code",
            "-w", "/code",
            langage.getImage_docker(),
            "sh", "-c", fullCmd
        );

        pb.redirectErrorStream(true);
        process = pb.start();

        // Lecture du flux de sortie
        new Thread(() -> {
            try (InputStream in = process.getInputStream()) {
                byte[] buffer = new byte[1024];
                int n;
                while ((n = in.read(buffer)) != -1) {
                    String data = new String(buffer, 0, n);
                    if (this.session.isOpen()) {
                        session.getBasicRemote().sendText(data);
                    }
                }
            } catch (IOException e) {
                // Gestion fin de flux
            } finally {
                try { 
                    if(session.isOpen()) session.getBasicRemote().sendText("\n[Processus terminé]\n"); 
                } catch(Exception e){}
            }
        }).start();
    }

    @OnMessage
    public void onMessage(String message) throws IOException {
        if (process != null && process.isAlive()) {
            process.getOutputStream().write((message + "\n").getBytes());
            process.getOutputStream().flush();
        }
    }

    @OnClose
    public void onClose() {
        if (process != null) {
            process.destroyForcibly();
        }
    }
}