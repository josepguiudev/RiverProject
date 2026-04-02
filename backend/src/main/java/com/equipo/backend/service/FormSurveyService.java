package com.equipo.backend.service;

import com.equipo.backend.model.Survey;
import com.equipo.backend.model.Question;
import com.equipo.backend.repository.SurveyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FormSurveyService {
    
    private final SurveyRepository surveyRepository;

    public FormSurveyService(SurveyRepository surveyRepository) {
        this.surveyRepository = surveyRepository;
    }

    /**
     * Guarda la plantilla de la encuesta junto con sus preguntas.
     * @Transactional asegura que si algo falla con una pregunta, 
     * no se guarde nada (mantiene la DB limpia).
     */
   @Transactional
    public Survey guardarEncuesta(Survey encuesta) {
        // 1. Manejo de fechas y valores por defecto (Evita errores de tipos primitivos)
        if (encuesta.getCreationDate() == null) {
            encuesta.setCreationDate(LocalDateTime.now());
        }
        
        // Aseguramos que los contadores no sean null si los cambiaste a Integer
        if (encuesta.getNumQuestions() == 0 && encuesta.getQuestionList() != null) {
            encuesta.setNumQuestions(encuesta.getQuestionList().size());
        }

        // 2. Vincular Preguntas Y Opciones (Relación bidireccional completa)
        if (encuesta.getQuestionList() != null) {
            for (Question pregunta : encuesta.getQuestionList()) {
                pregunta.setSurvey(encuesta); // Vincula Pregunta -> Encuesta
                
                // IMPORTANTE: También hay que vincular las opciones de cada pregunta
                if (pregunta.getOption() != null) {
                    for (com.equipo.backend.model.Option opcion : pregunta.getOption()) {
                        opcion.setQuestion(pregunta); // Vincula Opción -> Pregunta
                    }
                }
            }
        }

        // 3. Guardar todo en cascada (JPA se encarga de los inserts en orden)
        return surveyRepository.save(encuesta);
    }
    
    public List<Survey> obtenerTodas() {
        return surveyRepository.findAll();
    }

    public Survey obtenerPorId(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con ID: " + id));
    }

    public void guardarRespuesta(Survey survey) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'guardarRespuesta'");
    }

    public List<Survey> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }
}