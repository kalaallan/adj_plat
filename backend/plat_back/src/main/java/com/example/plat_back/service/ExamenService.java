package com.example.plat_back.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.plat_back.dto.ExamenDTO;
import com.example.plat_back.dto.LangageDTO;
import com.example.plat_back.models.Examen;
import com.example.plat_back.models.Langage;
import com.example.plat_back.repository.EnseignantRepository;
import com.example.plat_back.repository.ExamenRepository;
import com.example.plat_back.repository.LangageRepository;

@Service
public class ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private LangageRepository langageRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    /**
     * Crée un examen à partir d'un DTO et retourne le DTO sauvegardé.
     * Langage et Enseignant sont obligatoires.
     */
    public ExamenDTO createExamen(ExamenDTO dto) {
        if (dto.getNom() == null || dto.getCodeEx() == null) {
            throw new IllegalArgumentException("Nom et codeEx sont obligatoires");
        }
        if (examenRepository.existsById(dto.getCodeEx())) {
            throw new RuntimeException("Examen déjà existant !");
        }

        if (dto.getLangage() == null) {
            throw new RuntimeException("Le langage est obligatoire pour créer un examen.");
        }
        if (dto.getEnseignant() == null) {
            throw new RuntimeException("L'enseignant est obligatoire pour créer un examen.");
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

        // Mapping relation Langage
        Langage langage = langageRepository.findById(dto.getLangage())
                .orElseThrow(() -> new RuntimeException("Langage introuvable"));
        examen.setLangage(langage);

        // Mapping relation Enseignant
        examen.setEnseignant(
                enseignantRepository.findById(dto.getEnseignant())
                        .orElseThrow(() -> new RuntimeException("Enseignant introuvable"))
        );

        // Sauvegarde de l'examen
        Examen saved = examenRepository.save(examen);

        // Mapping retour : Examen -> ExamenDTO
        ExamenDTO savedDTO = new ExamenDTO();
        savedDTO.setCodeEx(saved.getCodeEx());
        savedDTO.setNom(saved.getNom());
        savedDTO.setMatiere(saved.getMatiere());
        savedDTO.setDuree(saved.getDuree());
        savedDTO.setConsigne(saved.getConsigne());
        savedDTO.setSujet(saved.getSujet());
        savedDTO.setStatut(saved.getStatut());
        savedDTO.setLangage(saved.getLangage().getId());
        savedDTO.setEnseignant(saved.getEnseignant().getId());

        return savedDTO;
    }

    public List<LangageDTO> getAllLangages() {

        List<Langage> langages = langageRepository.findAll();

        return langages.stream().map(lang -> {
            LangageDTO dto = new LangageDTO();
            dto.setId(lang.getId());
            dto.setNom(lang.getNom());
            dto.setExtension(lang.getExtension());
            dto.setImage_docker(lang.getImage_docker());
            dto.setCompile_cmd(lang.getCompile_cmd());
            dto.setRun_cmd(lang.getRun_cmd());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ExamenDTO> getAllExamens() {
        List<Examen> examens = examenRepository.findAll();
        return examens.stream().map(exam -> {
            ExamenDTO dto = new ExamenDTO();
            dto.setCodeEx(exam.getCodeEx());
            dto.setNom(exam.getNom());
            dto.setMatiere(exam.getMatiere());
            dto.setDuree(exam.getDuree());
            dto.setConsigne(exam.getConsigne());
            dto.setSujet(exam.getSujet());
            dto.setStatut(exam.getStatut());
            dto.setLangage(exam.getLangage().getId());
            dto.setEnseignant(exam.getEnseignant().getId());
            return dto;
        }).collect(Collectors.toList());
    }
    
}