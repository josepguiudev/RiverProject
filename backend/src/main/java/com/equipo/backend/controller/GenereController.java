package com.equipo.backend.controller;

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

import com.equipo.backend.service.GenereService;

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
}
