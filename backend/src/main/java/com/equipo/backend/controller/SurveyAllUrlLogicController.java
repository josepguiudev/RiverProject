package com.equipo.backend.controller;


import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.model.Survey;
import com.equipo.backend.model.Respuesta;
import com.equipo.backend.service.EncuestaService;
import com.equipo.backend.service.FormSurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/surveys") // Ruta base única para todo
@CrossOrigin(origins = "*")
public class SurveyAllUrlLogicController {

    private final FormSurveyService formSurveyService;
    private final EncuestaService encuestaService;

    public SurveyAllUrlLogicController(FormSurveyService formSurveyService, EncuestaService encuestaService) {
        this.formSurveyService = formSurveyService;
        this.encuestaService = encuestaService;
    }

    // --- MÉTODOS DE PLANTILLAS (FormSurvey) ---

    @GetMapping("/all")
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(formSurveyService.obtenerTodas());
    }

@PostMapping("/submit")
    public ResponseEntity<?> submitForm(@RequestBody Survey encuesta) {
        try {
            // 1. Validación preventiva: El nombre es lo mínimo necesario
            if (encuesta.getName() == null || encuesta.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El nombre de la encuesta es obligatorio"));
            }

            // 2. Llamada al servicio (que ya tiene la lógica de vinculación de hijos)
            Survey guardada = formSurveyService.guardarEncuesta(encuesta);

            // 3. Retornar 201 Created con el objeto ya persistido (incluyendo IDs de DB)
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);

        } catch (Exception e) {
            // IMPORTANTE: Esto te permite ver en tu consola de Java qué falló exactamente
            e.printStackTrace(); 
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al guardar la encuesta",
                    "details", e.getMessage()
                ));
        }
    }

    // --- MÉTODOS DE RESPUESTAS (SurveyResponse) ---

    @PostMapping("/responses/save")
    public ResponseEntity<?> saveRespuestas(
            @RequestBody EncuestaRespuestaDTO dto,
            @RequestParam(defaultValue = "false") boolean completada) {
        try {
            encuestaService.guardarRespuestas(dto, completada);
            return ResponseEntity.ok(Map.of("message", "Guardado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/responses/partial")
    public ResponseEntity<?> savePartialAnswer(
            @RequestBody EncuestaRespuestaDTO.RespuestaDTO respuestaIndividual,
            @RequestParam Long idUser,
            @RequestParam Long idEncuesta) {
        try {
            encuestaService.guardarRespuestaIndividual(idUser, idEncuesta, respuestaIndividual);
            return ResponseEntity.ok(Map.of("message", "Pregunta guardada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{idEncuesta}/responses")
    public ResponseEntity<EncuestaParcialDTO> cargarRespuestas(
            @PathVariable Long idEncuesta, 
            @RequestParam(name = "idUser") Long idUser) { // Especificamos el nombre explícitamente
        return ResponseEntity.ok(encuestaService.cargarRespuestas(idEncuesta, idUser));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend de River App funcionando correctamente!");
    }
}