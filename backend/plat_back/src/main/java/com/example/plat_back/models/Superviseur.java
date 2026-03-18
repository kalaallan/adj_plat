package com.example.plat_back.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Superviseur extends Utilisateur {

    private String departement; 

    // L'examen que le superviseur supervise
    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;

    // Historique des examens supervisés
    @ManyToMany
    @JoinTable(
        name = "superviseur_examens",
        joinColumns = @JoinColumn(name = "superviseur_id"),
        inverseJoinColumns = @JoinColumn(name = "examen_id")
    )
    private List<Examen> examensSupervises;

    public int getNombreExamensSupervises() {
        return examensSupervises != null ? examensSupervises.size() : 0;
    }
}

