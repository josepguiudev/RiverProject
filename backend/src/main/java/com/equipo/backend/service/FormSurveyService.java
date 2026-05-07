package com.equipo.backend.service;

import com.equipo.backend.model.*;
import com.equipo.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FormSurveyService {
    
    private final SurveyRepository surveyRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository; // Necesario para limpiar entidades
    private final GenereRepository genereRepository;     // Necesario para limpiar entidades

    public FormSurveyService(SurveyRepository surveyRepository, 
                             ClientRepository clientRepository,
                             CategoryRepository categoryRepository,
                             GenereRepository genereRepository) {
        this.surveyRepository = surveyRepository;
        this.clientRepository = clientRepository;
        this.categoryRepository = categoryRepository;
        this.genereRepository = genereRepository;
    }

    @Transactional
    public Survey guardarEncuesta(Survey encuesta, Long idClient) {
        // 1. Vincular al Cliente
        Client client = clientRepository.findById(idClient)
                .orElseThrow(() -> new RuntimeException("Error: Cliente no encontrado con ID: " + idClient));
        encuesta.setClient(client);

        // 2. SOLUCIÓN AL ERROR 500: Re-vincular Categorías y Géneros Detached
        // Esto evita el error "Detached entity passed to persist"
        if (encuesta.getCategoryList() != null && !encuesta.getCategoryList().isEmpty()) {
            List<Category> managedCategories = encuesta.getCategoryList().stream()
                .map(cat -> categoryRepository.findById(cat.getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + cat.getId())))
                .collect(Collectors.toList());
            encuesta.setCategoryList(managedCategories);
        }

        if (encuesta.getGenereList() != null && !encuesta.getGenereList().isEmpty()) {
            List<Genere> managedGeneres = encuesta.getGenereList().stream()
                .map(gen -> genereRepository.findById(gen.getId())
                    .orElseThrow(() -> new RuntimeException("Género no encontrado: " + gen.getId())))
                .collect(Collectors.toList());
            encuesta.setGenereList(managedGeneres);
        }

        // 3. Manejo de fechas
        if (encuesta.getCreationDate() == null) {
            encuesta.setCreationDate(LocalDateTime.now());
        }
        
        if ((encuesta.getNumQuestions() == null || encuesta.getNumQuestions() == 0) 
            && encuesta.getQuestionList() != null) {
            encuesta.setNumQuestions(encuesta.getQuestionList().size());
        }

        // 4. Vincular Preguntas, Opciones y Configuración (Relación bidireccional)
        if (encuesta.getQuestionList() != null) {
            for (Question pregunta : encuesta.getQuestionList()) {
                pregunta.setSurvey(encuesta); 
                
                // --- AÑADE ESTO PARA LA CONFIGURACIÓN ---
                if (pregunta.getConfig() != null) {
                    // Vinculamos la config con la pregunta (obligatorio por @MapsId)
                    pregunta.getConfig().setQuestion(pregunta);
                    
                    // Lógica de seguridad: aseguramos que isMultiple sea coherente con el tipo
                    String type = pregunta.getConfig().getTypeName();
                    if ("MULTIPLE_CHOICE".equals(type)) {
                        pregunta.getConfig().setIsMultiple(true);
                    } else if ("SINGLE_CHOICE".equals(type)) {
                        pregunta.getConfig().setIsMultiple(false);
                    }
                }
                // ----------------------------------------

                if (pregunta.getOption() != null) {
                    for (Option opcion : pregunta.getOption()) {
                        opcion.setQuestion(pregunta); 
                    }
                }
            }
        }

        // 5. Guardar todo
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