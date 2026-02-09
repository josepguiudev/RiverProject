package com.equipo.backend.controller;

import com.equipo.backend.model.FormResponse;
import com.equipo.backend.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "*")
public class FormController {
    
    @Autowired
    private FormService formService;
    
    @PostMapping("/submit")
    public ResponseEntity<FormResponse> submitForm(@RequestBody FormResponse respuesta) {
        try {
            FormResponse guardada = formService.guardarRespuesta(respuesta);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/responses")
    public ResponseEntity<List<FormResponse>> getAllResponses() {
        try {
            List<FormResponse> respuestas = formService.obtenerTodasRespuestas();
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