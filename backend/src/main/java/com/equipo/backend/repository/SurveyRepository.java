package com.equipo.backend.repository;

import com.equipo.backend.model.Survey;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {

@Query("SELECT s FROM Survey s WHERE s.id = :id")
Optional<Survey> findByIdWithQuestions(@Param("id") Long id);

    // Busca encuestas que un usuario tiene asignadas y no ha respondido
    @Query("SELECT s FROM Survey s")
    List<Survey> findAllSurveys();
    
    List<Survey> findByClientId(Long clientId);

}
