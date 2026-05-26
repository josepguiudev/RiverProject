package com.equipo.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.equipo.backend.model.Genere;
import com.equipo.backend.service.GenereService;
import com.equipo.backend.repository.GenereRepository;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/generes")
@CrossOrigin(origins = "*") 
public class GenereController {
    @Autowired
    private GenereService genereService;

    @PostMapping("/save-game-details")
    public ResponseEntity<?> saveGameDetails(@RequestBody Map<String, Object> fullSteamJson) {
        try {
            // Llamamos al método que ya tienes en GenereService
            genereService.saveGameDetailsAndGenres(fullSteamJson);
            return ResponseEntity.ok("Géneros actualizados correctamente en la base de datos.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar detalles: " + e.getMessage());
        }
    }

    @GetMapping("/external-details")
    public Mono<ResponseEntity<Object>> getExternalDetails(@RequestParam String appid) {
        WebClient webClient = WebClient.create("https://store.steampowered.com");

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/appdetails")
                        .queryParam("appids", appid)
                        .queryParam("l", "spanish")
                        .build())
                .retrieve()
                .bodyToMono(Object.class) // Recibimos el JSON de Steam como un objeto genérico
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                    ResponseEntity.badRequest().body("Error al conectar con Steam: " + e.getMessage())
                ));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Genere>> getAllGeneres() {
        try {
            return ResponseEntity.ok(genereService.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @Autowired
    private GenereRepository genereRepository; 

    @GetMapping("/all2")
    public ResponseEntity<?> getAllGeneres2() {
        try {
            // 1. Obtenemos el árbol de géneros y juegos normal
            List<Genere> list = genereService.findAll();
            
            // 2. Ejecutamos la función de agregación SQL nativa que cuenta y agrupa avatars
            List<Map<String, Object>> metadata = genereRepository.countAndAvatarsPerGenere();
            
            // 3. Empaquetamos todo de forma segura para evitar alterar la seguridad
            Map<String, Object> responseMap = Map.of(
                "generes", list,
                "metadata", metadata
            );
            
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al recuperar géneros y comunidad: " + e.getMessage());
        }
    }
}
