package com.example.plat_back.models;

import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Examen {

    @Id
    private String codeEx;  // ID fourni par l'utilisateur

    private String nom;
    private String matiere;
    private int duree;       // durée en minutes
    private String consigne;
    private String sujet;

    @Enumerated(EnumType.STRING)
    private StatutExamen statut;

    // Étudiants qui composent l'examen
    @OneToMany(mappedBy = "examen")
    private Set<Etudiant> etudiants;

    // Enseignant qui a créé l'examen
    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    // Superviseurs de l'examen
    @OneToMany(mappedBy = "examen")
    private Set<Superviseur> superviseurs;

    // Étudiants passés
    @ManyToMany(mappedBy = "examensPasses")
    private List<Etudiant> etudiantsPasses;

    // Chaque examen utilise un seul langage
    @ManyToOne
    @JoinColumn(name = "langage_id")
    private Langage langage;
}