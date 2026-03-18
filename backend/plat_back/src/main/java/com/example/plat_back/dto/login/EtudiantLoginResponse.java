package com.example.plat_back.dto.login;

import com.example.plat_back.models.Niveau;

import lombok.Data;

@Data
public class EtudiantLoginResponse {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String filiere;
    private Niveau niveau;
    private String examenId;     // Peut être null au moment du login
}
