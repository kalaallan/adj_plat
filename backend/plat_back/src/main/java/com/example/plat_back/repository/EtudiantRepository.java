package com.example.plat_back.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plat_back.models.Etudiant;

public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    // Ici tu peux ajouter des méthodes spécifiques aux étudiants si nécessaire
}