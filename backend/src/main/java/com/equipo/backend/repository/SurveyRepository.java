package com.equipo.backend.repository;

import com.equipo.backend.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {

    // Buscar encuestas por el ID del cliente (Dueño)
    List<Survey> findByClientId(Long clientId);

    // Consulta personalizada para obtener encuestas activas (ejemplo de lógica que podrías necesitar)
    @Query("SELECT s FROM Survey s WHERE s.closeDate > CURRENT_TIMESTAMP OR s.closeDate IS NULL")
    List<Survey> findAllActiveSurveys();
    
    // Si necesitas traer la encuesta con sus preguntas cargadas (Evitar LazyInitializationException)
    @Query("SELECT s FROM Survey s LEFT JOIN FETCH s.questionList WHERE s.id = :id")
    Survey findByIdWithQuestions(@Param("id") Long id);
}

//@Query("SELECT s FROM Survey s WHERE s.id = :id")
//Optional<Survey> findByIdWithQuestions(@Param("id") Long id);

