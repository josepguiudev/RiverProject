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
       
        if (encuesta.getCreationDate() == null) {
            encuesta.setCreationDate(LocalDateTime.now());
        }

        // 2. Vincular preguntas con la encuesta (Relación bidireccional)
        if (encuesta.getQuestionList() != null && !encuesta.getQuestionList().isEmpty()) {
            for (Question pregunta : encuesta.getQuestionList()) {
                pregunta.setSurvey(encuesta); // Esto llena la columna id_survey en SQL
            }
        }

        // 3. Guardar todo en cascada
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
}