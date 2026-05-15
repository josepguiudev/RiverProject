package com.equipo.backend.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.equipo.backend.model.Respuesta;
import com.equipo.backend.model.Survey;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {

    // 1. Buscar por Survey ID y User ID (Usando JPQL para ir directo y evitar nombres largos)
    @Query("SELECT r FROM Respuesta r WHERE r.option.question.survey.id = :idEncuesta AND r.user.id = :idUser")
    List<Respuesta> findBySurveyAndUser(@Param("idEncuesta") Long idEncuesta, @Param("idUser") Long idUser);

    // 2. Buscar una respuesta específica (Navegación automática por nombre)
    Optional<Respuesta> findByUserIdAndOption_Question_Id(Long userId, Long questionId);
    
    
    void deleteByUserIdAndOption_Question_Survey_Id(Long userId, Long surveyId);
    
    List<Respuesta> findByOption_Question_Survey_IdAndUserId(Long surveyId, Long userId);

    @Query("SELECT r.option.textOpcion as opcion, COUNT(r.id) as votos " +
           "FROM Respuesta r " +
           "WHERE r.option.question.survey.id = :idSurvey " +
           "GROUP BY r.option.id, r.option.textOpcion")
    List<Map<String, Object>> countVotosBySurveyId(@Param("idSurvey") Long idSurvey);
}

