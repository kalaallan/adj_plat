package com.example.plat_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.plat_back.models.Examen;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, String> {
    // String = type de la clé primaire (codeEx)
}