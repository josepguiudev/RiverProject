package com.equipo.backend.controller;

import com.equipo.backend.model.Survey;
import com.equipo.backend.service.FormSurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formSurvey")
@CrossOrigin(origins = "*")
public class FormSurveyController {
    
    private final FormSurveyService formSurveyService;

    public FormSurveyController(FormSurveyService formSurveyService) {
        this.formSurveyService = formSurveyService;
    }
    
    /**
     * Endpoint para guardar una nueva plantilla de encuesta con sus preguntas.
     * URL: POST http://localhost:8080/api/formSurvey/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(@RequestBody Survey encuesta) {
        
        System.out.println("Recibiendo nueva plantilla de encuesta: " + encuesta.getName()); 

        try {
            Survey guardada = formSurveyService.guardarEncuesta(encuesta);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al crear la plantilla: " + e.getMessage());
        }
    }
    
    /**
     * Endpoint para obtener todas las encuestas disponibles.
     * URL: GET http://localhost:8080/api/formSurvey/surveis
     */
    @GetMapping("/surveis")
    public ResponseEntity<List<Survey>> getAllSurveis() {
        try {
            List<Survey> surveys = formSurveyService.obtenerTodas();
            return ResponseEntity.ok(surveys);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend de River App funcionando correctamente!");
    }
}