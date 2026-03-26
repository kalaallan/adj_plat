package com.example.plat_back.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.plat_back.models.Etudiant;

public interface EtudiantRepository extends JpaRepository<Etudiant, String> {
    // Ici tu peux ajouter des méthodes spécifiques aux étudiants si nécessaire
    @Query("SELECT e FROM Etudiant e LEFT JOIN FETCH e.examen WHERE e.id = :id")
    Optional<Etudiant> findByIdWithExamen(@Param("id") String id);
}