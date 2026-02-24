package com.equipo.backend.repository;

import com.equipo.backend.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    // Aquí ya tienes métodos como .save(), .findAll(), .findById() por defecto
}