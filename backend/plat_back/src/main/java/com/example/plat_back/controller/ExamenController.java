package com.example.plat_back.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.plat_back.dto.ExamenDTO;
import com.example.plat_back.dto.LangageDTO;
import com.example.plat_back.service.ExamenService;

@RestController
@RequestMapping("/examen")
public class ExamenController {

    @Autowired
    private ExamenService examenService;

    // Endpoint pour uploader un fichier PDF
    @PostMapping("/upload/{nomExamen}")
    public ResponseEntity<String> uploadSujet(
            @RequestParam("file") MultipartFile file,
            @PathVariable String nomExamen) {

        try {
            // Base uploads
            String baseFolder = "D:/uploads/";

            // Créer dossier examen si n'existe pas
            Path examenFolder = Paths.get(baseFolder, nomExamen);
            if (!Files.exists(examenFolder)) {
                Files.createDirectories(examenFolder);
            }

            // Créer sous-dossier sujet si n'existe pas
            Path sujetFolder = examenFolder.resolve("sujet");
            if (!Files.exists(sujetFolder)) {
                Files.createDirectories(sujetFolder);
            }

            // Chemin complet du fichier
            Path filePath = sujetFolder.resolve(file.getOriginalFilename());

            // Sauvegarde du fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retourner le chemin relatif à stocker en BDD
            String relativePath = nomExamen + "/sujet/" + file.getOriginalFilename();

            return ResponseEntity.ok(relativePath);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping("/sujet/{nomExamen}/{filename}")
    public ResponseEntity<byte[]> downloadSujet(
            @PathVariable String nomExamen,
            @PathVariable String filename) {
        try {
            Path path = Paths.get("D:/uploads/", nomExamen, "sujet", filename);
            byte[] fileBytes = Files.readAllBytes(path);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(fileBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Endpoint pour créer un examen
    @PostMapping("/create")
    public ResponseEntity<ExamenDTO> createExamen(@RequestBody ExamenDTO examenDTO) {
        try {
            ExamenDTO savedExamen = examenService.createExamen(examenDTO);
            return ResponseEntity.ok(savedExamen);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/allLangage")
    public ResponseEntity<List<LangageDTO>> getAllLangages() {
        List<LangageDTO> langages = examenService.getAllLangages();
        return ResponseEntity.ok(langages);
    }

    @GetMapping("/allExamens")
    public ResponseEntity<List<ExamenDTO>> getAllExamens() {
        List<ExamenDTO> examens = examenService.getAllExamens();
        return ResponseEntity.ok(examens);
    }

    @GetMapping("/obtExamen/{id}")
    public ResponseEntity<ExamenDTO> getExamenById(@PathVariable String id) {
        try {
            ExamenDTO examen = examenService.getExamenById(id);
            return ResponseEntity.ok(examen);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur getExamenById pour id=" + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/updateStatut/{id}")
    public ResponseEntity<ExamenDTO> updateStatut(
            @PathVariable String id,
            @RequestParam String statut) {

        try {
            ExamenDTO updated = examenService.updateStatut(id, statut);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}