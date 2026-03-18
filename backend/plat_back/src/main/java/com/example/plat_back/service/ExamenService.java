package com.example.plat_back.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.plat_back.models.Examen;
import com.example.plat_back.repository.ExamenRepository;

@Service
public class ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private LangageRepository langageRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    public Examen createExamen(ExamenDTO dto) {

        if (examenRepository.existsById(dto.getCodeEx())) {
            throw new RuntimeException("Examen déjà existant !");
        }

        Examen examen = new Examen();

        // Mapping simple
        examen.setCodeEx(dto.getCodeEx());
        examen.setNom(dto.getNom());
        examen.setMatiere(dto.getMatiere());
        examen.setDuree(dto.getDuree());
        examen.setConsigne(dto.getConsigne());
        examen.setSujet(dto.getSujet());
        examen.setStatut(dto.getStatut());

        // 🔥 Mapping des relations
        if (dto.getLangageId() != null) {
            examen.setLangage(
                langageRepository.findById(Long.parseLong(dto.getLangageId()))
                    .orElseThrow(() -> new RuntimeException("Langage introuvable"))
            );
        }

        if (dto.getEnseignantId() != null) {
            examen.setEnseignant(
                enseignantRepository.findById(dto.getEnseignantId())
                    .orElseThrow(() -> new RuntimeException("Enseignant introuvable"))
            );
        }

        return examenRepository.save(examen);
    }
}