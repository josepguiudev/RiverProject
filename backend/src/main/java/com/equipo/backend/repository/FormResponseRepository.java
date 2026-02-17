package com.equipo.backend.repository;

import com.equipo.backend.model.FormResponse;
import com.equipo.backend.model.Survey;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@Repository
public interface FormResponseRepository extends JpaRepository<FormResponse, Long> {

    Survey save(Survey respuesta);
    // Spring Data JPA crea automáticamente los métodos básicos
}