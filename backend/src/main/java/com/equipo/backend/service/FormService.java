package com.equipo.backend.service;

import com.equipo.backend.model.FormResponse;
import com.equipo.backend.repository.FormResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@Service
public class FormService {
    
    @Autowired
    private FormResponseRepository repository;
    
    // Guardar una respuesta
    public FormResponse guardarRespuesta(FormResponse respuesta) {
        return repository.save(respuesta);
    }
    
    // Obtener todas las respuestas
    public List<FormResponse> obtenerTodasRespuestas() {
        return repository.findAll();
    }
    
    // Obtener una respuesta por ID
    public FormResponse obtenerRespuestaPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}