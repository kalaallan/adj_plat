package com.example.plat_back.dto;

import com.example.plat_back.models.Niveau;

import lombok.Data;

@Data
public class EtudiantDTO {

    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String filiere;
    private Niveau niveau;
    private String examenId;
    private String password;
    
}