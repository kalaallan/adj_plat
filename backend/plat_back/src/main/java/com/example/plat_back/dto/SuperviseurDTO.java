package com.example.plat_back.dto;

import lombok.Data;

@Data
public class SuperviseurDTO {

    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String departement;
    private String examenId;
    
}