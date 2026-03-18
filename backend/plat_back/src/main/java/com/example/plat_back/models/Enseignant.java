package com.example.plat_back.models;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Enseignant extends Utilisateur {

    private String matiere; // matière enseignée

    @OneToMany(mappedBy = "enseignant")
    private Set<Examen> examens;
}