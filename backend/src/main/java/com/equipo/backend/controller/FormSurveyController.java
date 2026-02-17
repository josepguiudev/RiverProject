package com.equipo.backend.controller;

import com.equipo.backend.model.Survey;
import com.equipo.backend.service.FormSurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@RestController
@RequestMapping("/api/formSurvey")
@CrossOrigin(origins = "*")
public class FormSurveyController {
    
    @Autowired
    private FormSurveyService FormSurveyService;
    
    @PostMapping("/submit")
    public ResponseEntity<Survey> submitForm(@RequestBody Survey respuesta) {
        try {
            Survey guardada = FormSurveyService.guardarRespuesta(respuesta);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/responses")
    public ResponseEntity<List<Survey>> getAllResponses() {
        try {
            List<Survey> respuestas = FormSurveyService.obtenerTodasRespuestas();
            return ResponseEntity.ok(respuestas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend funcionando correctamente!");
    }
}