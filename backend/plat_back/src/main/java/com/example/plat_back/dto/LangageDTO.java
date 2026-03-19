package com.example.plat_back.dto;

import lombok.Data;

@Data
public class LangageDTO {
    private String id;
    private String nom;
    private String extension;
    private String imageDocker;
    private String commandeExe;
}