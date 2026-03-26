package com.example.plat_back.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.plat_back.models.Langage;
import com.example.plat_back.repository.LangageRepository;

@Service
public class CompilerService {

    @Autowired
    private LangageRepository langageRepository;

    // Dossier local pour sauvegarder les codes temporaires
    private final String BASE_DIR = "D:/uploads/";

    /**
     * Exécute le code d'un étudiant dans un conteneur Docker.
     */
    public String runStudentCode(String code, String examId, String studentId, Integer langageId) 
            throws IOException, InterruptedException {

        // Récupérer le langage depuis la base
        Langage langage = langageRepository.findById(String.valueOf(langageId))
                .orElseThrow(() -> new RuntimeException("Langage introuvable"));

        // Créer un dossier unique pour l'étudiant et l'examen
        Path studentDir = Paths.get(BASE_DIR, examId + "_" + studentId);
        Files.createDirectories(studentDir);

        // Fichier Java fixe pour tous les étudiants
        String extension = langage.getExtension(); // ex: ".java"
        String filename = "Main" + extension;      // Main.java
        Path filePath = studentDir.resolve(filename);

        // Écrire le code dans le fichier
        Files.writeString(filePath, code);

        // Préparer les commandes avec remplacement éventuel de {filename}
        String compileCmd = null;
        if (langage.getCompile_cmd() != null && !langage.getCompile_cmd().isEmpty()) {
            compileCmd = langage.getCompile_cmd().replace("{filename}", filename);
        }

        // Pour Java, exécution doit se faire sur le nom de la classe (Main)
        String runCmd;
        if (langage.getNom().equalsIgnoreCase("Java")) {
            runCmd = "java Main";
        } else {
            runCmd = langage.getRun_cmd().replace("{filename}", filename);
        }

        // Combiner compilation + exécution
        String fullCmd = compileCmd != null ? compileCmd + " && " + runCmd : runCmd;

        // Construire la commande Docker
        List<String> dockerCommand = new ArrayList<>();
        dockerCommand.add("docker");
        dockerCommand.add("run");
        dockerCommand.add("--rm");
        dockerCommand.add("--network=none");              // isolation réseau
        dockerCommand.add("-v");
        dockerCommand.add(studentDir.toAbsolutePath() + ":/code"); // monter le dossier étudiant
        dockerCommand.add("-w");
        dockerCommand.add("/code");                      // dossier de travail dans Docker
        dockerCommand.add(langage.getImage_docker());
        dockerCommand.add("bash");
        dockerCommand.add("-c");
        dockerCommand.add(fullCmd);

        // Exécution du conteneur avec timeout
        ProcessBuilder pb = new ProcessBuilder(dockerCommand);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        boolean finished = process.waitFor(10, TimeUnit.SECONDS); // timeout de 10 secondes
        if (!finished) {
            process.destroyForcibly();
            return "Erreur : Exécution interrompue (timeout)";
        }

        // Lire la sortie standard (compilation + exécution)
        return new String(process.getInputStream().readAllBytes());
    }
}