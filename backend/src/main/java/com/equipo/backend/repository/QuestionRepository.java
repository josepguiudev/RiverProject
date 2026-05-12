package com.equipo.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.equipo.backend.model.Question;



@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    // Crucial: El JOIN FETCH obliga a traer las opciones de cada pregunta en una sola consulta
   @Query("SELECT q FROM Question q LEFT JOIN FETCH q.option WHERE q.survey.id = :surveyId")
    List<Question> findBySurveyIdWithOptions(@Param("surveyId") Long surveyId);

}