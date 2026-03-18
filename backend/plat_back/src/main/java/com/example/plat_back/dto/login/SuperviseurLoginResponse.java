package com.example.plat_back.dto.login;

import lombok.Data;

@Data
public class SuperviseurLoginResponse {
    private String id;
    private String email;
    private String nom;
    private String prenom;
    private String departement;  // Département supervisé
    private String examenId;     // Peut être null au moment du login
}