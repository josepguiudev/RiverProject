package com.equipo.backend.repository;

import com.equipo.backend.model.FormResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@Repository
public interface FormResponseRepository extends JpaRepository<FormResponse, Long> {
    // Spring Data JPA crea automáticamente los métodos básicos
}