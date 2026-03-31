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
    @PostMapping("/upload")
    public ResponseEntity<String> uploadSujet(@RequestParam("file") MultipartFile file) {
        try {
            // Dossier persistant
            String folder = "D:/uploads/";
            Path path = Paths.get(folder + file.getOriginalFilename());

            // Sauvegarde du fichier sur le disque
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // URL à stocker dans la BDD
            String url = "/uploads/" + file.getOriginalFilename();

            return ResponseEntity.ok(url);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
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
}