package com.example.plat_back.models;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@MappedSuperclass
public abstract class Utilisateur {

    @Id
    private String id; // l'utilisateur fournit cet id

    private String nom;
    private String prenom;
    private String email;
    private String password;
}