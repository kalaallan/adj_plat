package com.example.plat_back.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.plat_back.dto.EnseignantDTO;
import com.example.plat_back.dto.EtudiantDTO;
import com.example.plat_back.dto.SuperviseurDTO;
import com.example.plat_back.dto.login.LoginRequest;
import com.example.plat_back.dto.login.EtudiantLoginResponse;
import com.example.plat_back.dto.login.EnseignantLoginResponse;
import com.example.plat_back.dto.login.SuperviseurLoginResponse;
import com.example.plat_back.models.Enseignant;
import com.example.plat_back.models.Etudiant;
import com.example.plat_back.models.Superviseur;
import com.example.plat_back.repository.EnseignantRepository;
import com.example.plat_back.repository.EtudiantRepository;
import com.example.plat_back.repository.SuperviseurRepository;

@Service
public class UtilisateurService {

    private final EtudiantRepository etudiantRepository;
    private final EnseignantRepository enseignantRepository;
    private final SuperviseurRepository superviseurRepository;

    public UtilisateurService(EtudiantRepository etudiantRepository,
                              EnseignantRepository enseignantRepository,
                              SuperviseurRepository superviseurRepository) {
        this.etudiantRepository = etudiantRepository;
        this.enseignantRepository = enseignantRepository;
        this.superviseurRepository = superviseurRepository;
    }

    // --- GET ALL EXISTANTS ---

    public List<EtudiantDTO> getAllEtudiants() {
        return etudiantRepository.findAll()
                .stream()
                .map(this::convertToEtudiantDTO)
                .toList();
    }

    public List<EnseignantDTO> getAllEnseignants() {
        return enseignantRepository.findAll()
                .stream()
                .map(this::convertToEnseignantDTO)
                .toList();
    }

    public List<SuperviseurDTO> getAllSuperviseurs() {
        return superviseurRepository.findAll()
                .stream()
                .map(this::convertToSuperviseurDTO)
                .toList();
    }

    // --- LOGIN POST POUR CHAQUE TYPE ---
    public EtudiantLoginResponse loginEtudiant(LoginRequest request) {
        EtudiantDTO etudiant = getAllEtudiants().stream()
                .filter(e -> e.getEmail().equals(request.getEmail()) &&
                            e.getPassword().equals(request.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        return mapEtudiantToLoginResponse(etudiant);
    }

    public EnseignantLoginResponse loginEnseignant(LoginRequest request) {
        EnseignantDTO enseignant = getAllEnseignants().stream()
                .filter(e -> e.getEmail().equals(request.getEmail()) &&
                            e.getPassword().equals(request.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        return mapEnseignantToLoginResponse(enseignant);
    }

    public SuperviseurLoginResponse loginSuperviseur(LoginRequest request) {
        SuperviseurDTO superviseur = getAllSuperviseurs().stream()
                .filter(s -> s.getEmail().equals(request.getEmail()) &&
                            s.getPassword().equals(request.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));
        return mapSuperviseurToLoginResponse(superviseur);
    }

    // Mappings
    private EtudiantLoginResponse mapEtudiantToLoginResponse(EtudiantDTO etudiant) {
        EtudiantLoginResponse response = new EtudiantLoginResponse();
        response.setId(etudiant.getId());
        response.setNom(etudiant.getNom());
        response.setPrenom(etudiant.getPrenom());
        response.setEmail(etudiant.getEmail());
        response.setFiliere(etudiant.getFiliere());
        response.setNiveau(etudiant.getNiveau());
        response.setExamenId(etudiant.getExamenId());
        return response;
    }

    private EnseignantLoginResponse mapEnseignantToLoginResponse(EnseignantDTO enseignant) {
        EnseignantLoginResponse response = new EnseignantLoginResponse();
        response.setId(enseignant.getId());
        response.setNom(enseignant.getNom());
        response.setPrenom(enseignant.getPrenom());
        response.setEmail(enseignant.getEmail());
        response.setMatiere(enseignant.getMatiere());
        return response;
    }

    private SuperviseurLoginResponse mapSuperviseurToLoginResponse(SuperviseurDTO superviseur) {
        SuperviseurLoginResponse response = new SuperviseurLoginResponse();
        response.setId(superviseur.getId());
        response.setNom(superviseur.getNom());
        response.setPrenom(superviseur.getPrenom());
        response.setEmail(superviseur.getEmail());
        response.setDepartement(superviseur.getDepartement());
        response.setExamenId(superviseur.getExamenId());
        return response;
    }
    // --- CONVERT DTOs EXISTANTS ---

    private EtudiantDTO convertToEtudiantDTO(Etudiant etudiant) {
        EtudiantDTO dto = new EtudiantDTO();
        dto.setId(etudiant.getId());
        dto.setEmail(etudiant.getEmail());
        dto.setNom(etudiant.getNom());
        dto.setPrenom(etudiant.getPrenom());
        dto.setFiliere(etudiant.getFiliere());
        dto.setNiveau(etudiant.getNiveau());
        dto.setExamenId(etudiant.getExamen() != null ? etudiant.getExamen().getCodeEx() : null);
        dto.setPassword(etudiant.getPassword()); // nécessaire pour login
        return dto;
    }

    private EnseignantDTO convertToEnseignantDTO(Enseignant enseignant) {
        EnseignantDTO dto = new EnseignantDTO();
        dto.setId(enseignant.getId());
        dto.setNom(enseignant.getNom());
        dto.setPrenom(enseignant.getPrenom());
        dto.setEmail(enseignant.getEmail());
        dto.setPassword(enseignant.getPassword()); // nécessaire pour login
        return dto;
    }

    private SuperviseurDTO convertToSuperviseurDTO(Superviseur superviseur) {
        SuperviseurDTO dto = new SuperviseurDTO();
        dto.setId(superviseur.getId());
        dto.setNom(superviseur.getNom());
        dto.setPrenom(superviseur.getPrenom());
        dto.setEmail(superviseur.getEmail());
        dto.setPassword(superviseur.getPassword()); // nécessaire pour login
        return dto;
    }
}