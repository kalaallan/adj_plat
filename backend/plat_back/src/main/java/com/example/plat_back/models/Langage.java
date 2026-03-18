package com.example.plat_back.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Langage {

    @Id
    private String id;

    private String nom;
    private String extension;
    private String imageDocker;
    private String commandeExe;

    @OneToMany(mappedBy = "langage")
    private Set<Examen> examens;
}