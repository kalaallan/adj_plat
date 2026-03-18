package com.example.plat_back.dto;

import lombok.Data;

@Data
public class EnseignantDTO {

    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String matiere;
    private String password;
}