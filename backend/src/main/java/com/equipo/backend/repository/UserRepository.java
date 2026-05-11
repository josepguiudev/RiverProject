package com.equipo.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.equipo.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(long id);

    @Query("SELECT u FROM User u WHERE u NOT IN (SELECT us.user FROM UserSurveys us WHERE us.survey.id = :surveyId)")
    List<User> findUsersNotAssignedToSurvey(@Param("surveyId") Long surveyId);
}

