package com.equipo.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.equipo.backend.model.OpcionRespuesta;


@Repository
public interface OptionRespuestaRepository extends JpaRepository<OpcionRespuesta, Long> {
     // Aquí ya tienes métodos como .save(), .findAll(), .findById() por defecto
}
