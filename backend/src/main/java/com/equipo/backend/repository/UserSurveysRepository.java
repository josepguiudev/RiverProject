package com.equipo.backend.repository;

import com.equipo.backend.model.User;
import com.equipo.backend.model.UserSurveys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository
public interface UserSurveysRepository extends JpaRepository<UserSurveys, Long> {
    
    // Usamos .id o el nombre real de la PK en la entidad User (ej: .idUsuario)
    @Query("SELECT us FROM UserSurveys us WHERE us.user.id = :userId")
    List<UserSurveys> findByUserId(@Param("userId") Long userId);


    // El "JOIN FETCH" trae la encuesta en la misma consulta que la relación
    @Query("SELECT us FROM UserSurveys us JOIN FETCH us.survey WHERE us.user.id = :userId")
    List<UserSurveys> findByUserIdWithSurvey(@Param("userId") Long userId);

    @Query("SELECT us FROM UserSurveys us WHERE us.user.id = :userId AND us.survey.id = :surveyId")
    Optional<UserSurveys> findByUserIdAndSurveyId(@Param("userId") Long userId, @Param("surveyId") Long surveyId);

    long countByIsRespondida(byte isRespondida);
}