package com.example.plat_back.dto;

import com.example.plat_back.models.StatutExamen;

import lombok.Data;

@Data
public class ExamenDTO {
    private String codeEx;
    private String consigne;
    private int duree;
    private String matiere;
    private String nom;
    private String sujet;
    private StatutExamen statut;
    private String enseignant;
    private String langage;
}