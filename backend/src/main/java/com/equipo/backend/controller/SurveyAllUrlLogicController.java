package com.equipo.backend.controller;

import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.dto.SurveySummaryDTO;
import com.equipo.backend.model.Category; // Importar tu modelo
import com.equipo.backend.model.Genere;   // Importar tu modelo
import com.equipo.backend.model.Survey;
import com.equipo.backend.repository.CategoryRepository; // Importar tu repo
import com.equipo.backend.repository.GenereRepository;   // Importar tu repo
import com.equipo.backend.repository.UserSurveysRepository;
import com.equipo.backend.service.EncuestaService;
import com.equipo.backend.service.FormSurveyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "*")
public class SurveyAllUrlLogicController {

    private final FormSurveyService formSurveyService;
    private final EncuestaService encuestaService;
    private final UserSurveysRepository userSurveysRepository;
    private final CategoryRepository categoryRepository; // Inyectado
    private final GenereRepository genereRepository;     // Inyectado

    public SurveyAllUrlLogicController(FormSurveyService formSurveyService, 
                                       EncuestaService encuestaService, 
                                       UserSurveysRepository userSurveysRepository,
                                       CategoryRepository categoryRepository,
                                       GenereRepository genereRepository) {
        this.formSurveyService = formSurveyService;
        this.encuestaService = encuestaService;
        this.userSurveysRepository = userSurveysRepository;
        this.categoryRepository = categoryRepository;
        this.genereRepository = genereRepository;
    }

    // --- NUEVOS MÉTODOS PARA METADATOS (CATEGORÍAS Y GÉNEROS) ---

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/generes")
    public ResponseEntity<List<Genere>> getGeneres() {
        return ResponseEntity.ok(genereRepository.findAll());
    }

    // --- MÉTODOS DE PLANTILLAS (FormSurvey) ---

    @GetMapping("/all")
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(formSurveyService.obtenerTodas());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(
            @RequestBody Survey encuesta, 
            @RequestParam Long idClient) {
        try {
            if (encuesta.getName() == null || encuesta.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "El nombre de la encuesta es obligatorio"));
            }

            Survey guardada = formSurveyService.guardarEncuesta(encuesta, idClient);
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
            @RequestParam(name = "idUser") Long idUser) {
        return ResponseEntity.ok(encuestaService.cargarRespuestas(idEncuesta, idUser));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend de River App funcionando correctamente!");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SurveySummaryDTO>> getSurveysByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(encuestaService.obtenerResumenEncuestasPorUsuario(userId));
    }

    @GetMapping("/{idSurvey}/resultados")
    public ResponseEntity<?> getResultadosEncuesta(@PathVariable Long idSurvey) {
        try {
            // Llamamos al servicio matemático que acabamos de estabilizar en los pasos anteriores
            return ResponseEntity.ok(encuestaService.obtenerEstadisticasVotos(idSurvey));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar métricas de votación: " + e.getMessage());
        }
    }

    @GetMapping("/metrics/global-summary")
    public ResponseEntity<?> getGlobalSurveyMetrics() {
        try {
            // Contamos directamente cuántas filas de la tabla intermedia están marcadas como respondidas (1)
            long respondidas = userSurveysRepository.countByIsRespondida((byte) 1);
            
            // Contamos el total de plantillas de encuestas registradas en el sistema
            long totales = formSurveyService.obtenerTodas().size();

            return ResponseEntity.ok(Map.of(
                "totalSurveys", totales,
                "totalAnswered", respondidas
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al calcular métricas globales: " + e.getMessage());
        }
    }
}