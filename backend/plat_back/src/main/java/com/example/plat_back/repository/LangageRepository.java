package com.example.plat_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.plat_back.models.Langage;

public interface LangageRepository extends JpaRepository<Langage, String> {
    // Méthodes spécifiques aux langages

}
