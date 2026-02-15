package com.equipo.backend.service;


import com.equipo.backend.model.Survey;
import com.equipo.backend.repository.FormSurveyResponseRepsitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@Service
public class FormSurveyService {
    
     @Autowired
    private FormSurveyResponseRepsitory repository;
    
    // Guardar una respuesta
    public Survey guardarRespuesta(Survey respuesta) {
        return repository.save(respuesta);
    }
    
    // Obtener todas las respuestas
    public List<Survey> obtenerTodasRespuestas() {
        return repository.findAll();
    }
    
    // Obtener una respuesta por ID
    public Survey obtenerRespuestaPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}