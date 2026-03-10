package com.equipo.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import com.equipo.backend.dto.GameSteamRequest;
import com.equipo.backend.model.Game;
import com.equipo.backend.service.GameSteamService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*") 
public class GameSteamController {
    @Autowired
    private GameSteamService gameService; // Inyecta el Service, no el Repository

    @PostMapping("/register")
    public ResponseEntity<Game> registerGame(@RequestBody GameSteamRequest request) {
        return ResponseEntity.ok(gameService.registerGame(request));
    }

    @GetMapping("/external-extract")
    public Mono<ResponseEntity<Object>> extractFromSteam(@RequestParam String steamid, @RequestParam String apiKey) {
    WebClient webClient = WebClient.create("https://api.steampowered.com");

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/IPlayerService/GetOwnedGames/v1/")
                        .queryParam("key", apiKey)
                        .queryParam("steamid", steamid)
                        .queryParam("include_appinfo", 1)
                        .queryParam("include_played_free_games", 1)
                        .queryParam("format", "json")
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                    ResponseEntity.badRequest().body("Error al conectar con Steam: " + e.getMessage())
                ));
    }

    @PostMapping("/save-steam-library")
    public ResponseEntity<?> saveSteamLibrary(@RequestBody List<java.util.Map<String, Object>> steamGames) {
        try {
            // 1. Convertimos el JSON crudo de Steam a tu lista de DTOs (GameSteamRequest)
            List<GameSteamRequest> requests = steamGames.stream()
                .map(game -> {
                    GameSteamRequest dto = new GameSteamRequest();
                    // Steam devuelve los IDs como Integer/Long, nos aseguramos de pasarlos a Long
                    dto.setAppid(Long.valueOf(game.get("appid").toString()));
                    dto.setName((String) game.get("name"));
                    dto.setImg_icon_url((String) game.get("img_icon_url"));
                    return dto;
                })
                .collect(Collectors.toList());

            // 2. Llamamos al servicio con la variable 'requests' ya definida
            List<Game> guardados = gameService.registerMultipleGames(requests);
            
            if (guardados.isEmpty()) {
                return ResponseEntity.ok("Todos los juegos ya estaban registrados en la base de datos.");
            }
            
            return ResponseEntity.ok("Se han guardado " + guardados.size() + " juegos nuevos correctamente.");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar la biblioteca: " + e.getMessage());
        }
    }
}
