package com.example.plat_back.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Superviseur extends Utilisateur {

    private String departement; 

    // L'examen que le superviseur supervise (relation actuelle)
    @ManyToOne
    @JoinColumn(name = "examen_id")
    private Examen examen;

}