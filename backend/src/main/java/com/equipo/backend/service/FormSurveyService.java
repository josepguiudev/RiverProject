package com.equipo.backend.service;

import com.equipo.backend.model.Survey;
import com.equipo.backend.model.Question;
import com.equipo.backend.model.Option;
import com.equipo.backend.model.Client;
import com.equipo.backend.repository.SurveyRepository;
import com.equipo.backend.repository.ClientRepository; // <--- Importante
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FormSurveyService {
    
    private final SurveyRepository surveyRepository;
    private final ClientRepository clientRepository; // <--- Añadido

    public FormSurveyService(SurveyRepository surveyRepository, ClientRepository clientRepository) {
        this.surveyRepository = surveyRepository;
        this.clientRepository = clientRepository;
    }

    /**
     * Guarda la plantilla de la encuesta vinculándola a un Cliente específico.
     */
    @Transactional
    public Survey guardarEncuesta(Survey encuesta, Long idClient) {
        // 1. Vincular al Cliente (Dueño de la encuesta)
        Client client = clientRepository.findById(idClient)
                .orElseThrow(() -> new RuntimeException("Error: Cliente no encontrado con ID: " + idClient));
        
        encuesta.setClient(client);

        // 2. Manejo de fechas y valores por defecto
        if (encuesta.getCreationDate() == null) {
            encuesta.setCreationDate(LocalDateTime.now());
        }
        
        // Sincronizar contador de preguntas si viene en 0
        if ((encuesta.getNumQuestions() == null || encuesta.getNumQuestions() == 0) 
            && encuesta.getQuestionList() != null) {
            encuesta.setNumQuestions(encuesta.getQuestionList().size());
        }

        // 3. Vincular Preguntas Y Opciones (Relación bidireccional)
        if (encuesta.getQuestionList() != null) {
            for (Question pregunta : encuesta.getQuestionList()) {
                pregunta.setSurvey(encuesta); 
                
                if (pregunta.getOption() != null) {
                    for (Option opcion : pregunta.getOption()) {
                        opcion.setQuestion(pregunta); 
                    }
                }
            }
        }

        // 4. Guardar todo en cascada
        return surveyRepository.save(encuesta);
    }
    
    // --- Métodos de consulta ---

    public List<Survey> obtenerTodas() {
        return surveyRepository.findAll();
    }

    /**
     * Recupera solo las encuestas que pertenecen a una empresa específica.
     */
    public List<Survey> obtenerPorCliente(Long idClient) {
        return surveyRepository.findByClientId(idClient);
    }

    public Survey obtenerPorId(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con ID: " + id));
    }
}