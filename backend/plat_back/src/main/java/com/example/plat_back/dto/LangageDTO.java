package com.example.plat_back.dto;

import lombok.Data;

@Data
public class LangageDTO {
    private String id;
    private String nom;
    private String extension;
    private String image_docker;
    private String compile_cmd;
    private String run_cmd;
}