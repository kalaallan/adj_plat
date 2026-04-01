package com.example.plat_back.websocket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ConcurrentHashMap;

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
import java.util.Map;

@ServerEndpoint(value = "/ws/terminal/{examId}/{userId}/{langageId}/{role}")
@Component
public class TerminalWebSocket {

    private Process process;
    private Session session;
    private static final Map<String, Session> studentSessions = new ConcurrentHashMap<>();
    private static final Map<String, java.util.List<Session>> examSupervisors = new ConcurrentHashMap<>();
    private Path studentDir;
    private Langage langage;
    private final String BASE_DIR = "D:/uploads/";
    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    @OnOpen
    public void onOpen(Session session,
                    @PathParam("examId") String examId,
                    @PathParam("userId") String userId,
                    @PathParam("langageId") String langageId,
                    @PathParam("role") String role) {

        this.session = session;
        session.setMaxIdleTimeout(0);

        // Stocker les infos dans la session
        session.getUserProperties().put("examId", examId);
        session.getUserProperties().put("userId", userId);
        session.getUserProperties().put("role", role);

        // Enregistrer session
        if ("etudiant".equals(role)) {
            studentSessions.put(userId, session);
        } else if ("superviseur".equals(role)) {
            examSupervisors
                .computeIfAbsent(examId, k -> new CopyOnWriteArrayList<>())
                .add(session);
        }

        try {
            ExamenRepository examRepo = BeanUtil.getBean(ExamenRepository.class);
            EtudiantRepository studentRepo = BeanUtil.getBean(EtudiantRepository.class);
            LangageRepository langRepo = BeanUtil.getBean(LangageRepository.class);

            this.langage = langRepo.findById(langageId).orElseThrow();
            Examen exam = examRepo.findByIdWithDetails(examId).orElseThrow();

            // seulement si étudiant
            if ("etudiant".equals(role)) {
                Etudiant student = studentRepo.findById(userId).orElseThrow();

                String safePath = sanitize(exam.getNom()) + "/" +
                        sanitize(student.getNom() + "_" + student.getPrenom());

                this.studentDir = Paths.get(BASE_DIR, safePath);
                Files.createDirectories(studentDir);
            }

            sendToClient("{\"type\":\"OUTPUT\",\"message\":\"Connecté\\n\"}");

        } catch (IOException e) {
            sendToClient("{\"type\":\"ERROR\",\"message\":\"Init error\"}");
        }
    }

    @OnMessage
    public void onMessage(String message) {
        try {
            // Parser JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> data = mapper.readValue(
                message,
                new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
            );

            String type = (String) data.get("type");

            switch (type) {
                case "CODE" -> executeCode((String) data.get("data"));
                case "INPUT" -> {
                    if (process != null && process.isAlive()) {
                        OutputStream os = process.getOutputStream();
                        os.write((data.get("data") + "\n").getBytes());
                        os.flush();
                    }
                }
                case "ALERT" -> {
                    String role = (String) session.getUserProperties().get("role");
                    if ("etudiant".equals(role)) {
                        handleAlert(data.get("data"));
                    }
                }
                default -> sendToClient("{\"type\":\"ERROR\",\"message\":\"Type inconnu\"}");
            }

        } catch (IOException | RuntimeException e) {
            sendToClient("{\"type\":\"ERROR\",\"message\":\"Erreur parsing JSON\"}");
        }
    }

    private void handleAlert(Object alertData) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

            String examId = (String) session.getUserProperties().get("examId");
            String userId = (String) session.getUserProperties().get("userId");

            // récupérer étudiant
            EtudiantRepository studentRepo = BeanUtil.getBean(EtudiantRepository.class);
            Etudiant student = studentRepo.findById(userId).orElse(null);

            String fullName = (student != null)
                    ? student.getNom() + " " + student.getPrenom()
                    : "Inconnu";

            String json = mapper.writeValueAsString(
                Map.of(
                    "type", "ALERT",
                    "message", alertData,
                    "etudiant", fullName
                )
            );

            // envoyer à l'étudiant
            sendToClient(json);

            // envoyer aux superviseurs
            var supervisors = examSupervisors.get(examId);  

            if (supervisors != null) {
                for (Session supSession : supervisors) {
                    if (supSession.isOpen()) {
                        supSession.getBasicRemote().sendText(json);
                    }
                }
            }

            System.out.println("ALERT envoyée : " + json);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void executeCode(String sourceCode) {

        String role = (String) session.getUserProperties().get("role");

        if (!"etudiant".equals(role) || studentDir == null) {
            sendToClient("{\"type\":\"ERROR\",\"message\":\"Accès refusé\"}");
            return;
        }

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
                sendToClient(
                    "{\"type\":\"OUTPUT\",\"message\":\"" 
                    + escape(new String(buffer, 0, n)) 
                    + "\"}"
                );
            }
        } catch (IOException | RuntimeException e) {
        } finally {
            isRunning.set(false);
            sendToClient("\n[Terminé]\n");
        }
    }

    private String escape(String text) {
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
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

        String role = (String) session.getUserProperties().get("role");
        String userId = (String) session.getUserProperties().get("userId");
        String examId = (String) session.getUserProperties().get("examId");

        if ("etudiant".equals(role)) {
            studentSessions.remove(userId);
        } else if ("superviseur".equals(role)) {
            var list = examSupervisors.get(examId);
            if (list != null) list.remove(session);
        }
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