package com.example.plat_back.dto.login;

import lombok.Data;

@Data
public class EnseignantLoginResponse {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String matiere;      // Matière enseignée
}