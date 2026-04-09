package com.equipo.backend.controller;


import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.dto.SurveySummaryDTO;
import com.equipo.backend.model.Survey;
import com.equipo.backend.model.UserSurveys;
import com.equipo.backend.repository.UserSurveysRepository;
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
    private final UserSurveysRepository userSurveysRepository;

    // CORRECCIÓN: Cambiamos UserSurveys por UserSurveysRepository en los parámetros
    public SurveyAllUrlLogicController(FormSurveyService formSurveyService, 
                                       EncuestaService encuestaService, 
                                       UserSurveysRepository userSurveysRepository) {
        this.formSurveyService = formSurveyService;
        this.encuestaService = encuestaService;
        this.userSurveysRepository = userSurveysRepository; 
    }
    // --- MÉTODOS DE PLANTILLAS (FormSurvey) ---

    @GetMapping("/all")
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(formSurveyService.obtenerTodas());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(
            @RequestBody Survey encuesta, 
            @RequestParam Long idClient) { // <--- Capturamos el ID desde la URL (?idClient=XX)
        try {
            // 1. Validación preventiva
            if (encuesta.getName() == null || encuesta.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El nombre de la encuesta es obligatorio"));
            }

            // 2. Llamada al servicio pasando el ID real del cliente
            // El servicio que corregimos antes buscará al Cliente en la DB y lo asignará
            Survey guardada = formSurveyService.guardarEncuesta(encuesta, idClient);

            // 3. Retornar 201 Created
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al guardar la encuesta",
                    "details", e.getMessage()
                ));
        }
    }
    
    @GetMapping("/my-surveys/{clientId}")
    public ResponseEntity<List<Survey>> getMySurveys(@PathVariable Long clientId) {
        List<Survey> encuestas = formSurveyService.obtenerPorCliente(clientId);
        return ResponseEntity.ok(encuestas);
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SurveySummaryDTO>> getSurveysByUser(@PathVariable Long userId) {
        // El Service ahora usa findByUserIdWithSurvey internamente
        return ResponseEntity.ok(encuestaService.obtenerResumenEncuestasPorUsuario(userId));
    }
}

