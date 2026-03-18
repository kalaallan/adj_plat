package com.example.plat_back.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.plat_back.dto.EnseignantDTO;
import com.example.plat_back.dto.EtudiantDTO;
import com.example.plat_back.dto.SuperviseurDTO;
import com.example.plat_back.dto.login.EnseignantLoginResponse;
import com.example.plat_back.dto.login.EtudiantLoginResponse;
import com.example.plat_back.dto.login.LoginRequest;
import com.example.plat_back.dto.login.SuperviseurLoginResponse;
import com.example.plat_back.service.UtilisateurService;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("/etudiants")
    public List<EtudiantDTO> getAllEtudiants() {
        return utilisateurService.getAllEtudiants();
    }

    @GetMapping("/enseignants")
    public List<EnseignantDTO> getAllEnseignants() {
        return utilisateurService.getAllEnseignants();
    }

    @GetMapping("/superviseurs")
    public List<SuperviseurDTO> getAllSuperviseurs() {
        return utilisateurService.getAllSuperviseurs();
    }


    @PostMapping("/login/etudiant")
    public EtudiantLoginResponse loginEtudiant(@RequestBody LoginRequest request) {
        return utilisateurService.loginEtudiant(request);
    }

    @PostMapping("/login/enseignant")
    public EnseignantLoginResponse loginEnseignant(@RequestBody LoginRequest request) {
        return utilisateurService.loginEnseignant(request);
    }

    @PostMapping("/login/superviseur")
    public SuperviseurLoginResponse loginSuperviseur(@RequestBody LoginRequest request) {
        return utilisateurService.loginSuperviseur(request);
    }
    
}