package com.equipo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.equipo.backend.model.Option;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    // Aquí ya tienes métodos como .save(), .findAll(), .findById() por defecto
}