package com.example.plat_back.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plat_back.models.Superviseur;

public interface SuperviseurRepository extends JpaRepository<Superviseur, String> {
    // Méthodes spécifiques aux superviseurs
}