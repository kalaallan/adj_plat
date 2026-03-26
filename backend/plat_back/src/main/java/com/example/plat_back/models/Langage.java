package com.example.plat_back.models;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Langage {

    @Id
    private String id;

    private String nom;
    private String extension;
    private String image_docker;
    private String compile_cmd;
    private String run_cmd;

    @OneToMany(mappedBy = "langage")
    private Set<Examen> examens;
}
