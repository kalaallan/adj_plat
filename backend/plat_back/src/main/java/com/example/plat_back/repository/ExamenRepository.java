package com.example.plat_back.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.plat_back.models.Examen;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, String> {
    // String = type de la clé primaire (codeEx)
    @Query("SELECT e FROM Examen e LEFT JOIN FETCH e.langage LEFT JOIN FETCH e.enseignant WHERE e.codeEx = :id")
    Optional<Examen> findByIdWithDetails(@Param("id") String id);
}