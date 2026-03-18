package com.example.plat_back.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToMany;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Etudiant extends Utilisateur {

    @Enumerated(EnumType.STRING)
    private Niveau niveau;

    private String filiere;

    // L'examen actuellement sélectionné
    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;

    // Historique des examens passés
    @ManyToMany
    @JoinTable(
        name = "etudiant_examens",
        joinColumns = @JoinColumn(name = "etudiant_id"),
        inverseJoinColumns = @JoinColumn(name = "examen_id")
    )
    private List<Examen> examensPasses;

    // Pour obtenir le nombre d'examens passés
    public int getNombreExamensPasses() {
        return examensPasses != null ? examensPasses.size() : 0;
    }
}