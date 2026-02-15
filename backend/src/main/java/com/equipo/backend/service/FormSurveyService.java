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
    
   
    public FormSurveyService(FormSurveyResponseRepsitory repository) {
        this.repository = repository;
    }
    
    public Survey guardarRespuesta(Survey respuesta) {
        return repository.save(respuesta);
    }
    
    public List<Survey> obtenerTodasRespuestas() {
        return repository.findAll();
    }
    
    public Survey obtenerRespuestaPorId(Long id) {
        return repository.findById(id).orElse(null);
    }
}