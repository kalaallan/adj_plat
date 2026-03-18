package com.example.plat_back.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plat_back.models.Enseignant;

public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    // Méthodes spécifiques aux enseignants
}