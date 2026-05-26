package com.equipo.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
    public Mono<ResponseEntity<Object>> extractFromSteam(@RequestParam(required = false) String steamid, @RequestParam(required = false) String apiKey) {
        if (steamid == null || steamid.trim().isEmpty() || apiKey == null || apiKey.trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body("Error: steamid y apiKey son requeridos y no pueden estar vacíos."));
        }
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
                        ResponseEntity.badRequest().body("Error al conectar con Steam: " + e.getMessage())));
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/save-steam-library")
    public ResponseEntity<?> saveSteamLibrary(@RequestBody java.util.Map<String, Object> payload) {
        try {
            // Extraemos el steamid del mapa
            String steamid = (String) payload.get("steamid");

            // Extraemos la lista de juegos del mapa raíz (haciendo el cast)
            List<java.util.Map<String, Object>> steamGames = (List<java.util.Map<String, Object>>) payload.get("games");

            if (steamGames == null) {
                throw new Exception("La lista de juegos 'games' no puede estar vacía");
            }
            // Convertimos el JSON crudo a tus DTOs
            List<GameSteamRequest> requests = steamGames.stream()
                    .map(game -> {
                        GameSteamRequest dto = new GameSteamRequest();
                        dto.setAppid(Long.valueOf(game.get("appid").toString()));
                        dto.setName((String) game.get("name"));
                        dto.setImg_icon_url((String) game.get("img_icon_url"));
                        return dto;
                    })
                    .collect(Collectors.toList());

            // Llamamos al nuevo método del servicio que vincula al usuario
            gameService.saveLibraryAndLinkToUser(steamid, requests);

            return ResponseEntity.ok("Biblioteca sincronizada correctamente para el usuario " + steamid);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al procesar la biblioteca: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Game update(@PathVariable Long id, @RequestBody Game game) {
        return gameService.update(id, game);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gameService.delete(id);
    }

    @GetMapping("/sync-library") // Esto sirve para que React entienda que si llama a esta "puerta" recibirá la
                                 // sincronización de la biblioteca de un usuario.
    // Y a continuación se define lo que la "puerta" devolverá.
    // Mono es lo mismo que promise de javascript.
    // ResponseEntiti<> es como una "caja" que envuelve la respuesta.
    // <String> es el tipo de dato que envuelve la "caja".
    // manualSync es básicamente el nombre de la "puerta", puede llamarse como te
    // cante el gallo.
    // Los @RequestParam son los parámetros diciendole a Java de dónde sacarlos.
    // .map() envuelve la respuesta de los parámetros dentro de la "caja"
    // (ResponseEntity).
    public Mono<ResponseEntity<String>> manualSync(@RequestParam(required = false) String steamid, @RequestParam(required = false) String apiKey) {
        if (steamid == null || steamid.trim().isEmpty() || apiKey == null || apiKey.trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body("Error: steamid y apiKey son obligatorios para sincronizar la biblioteca."));
        }
        return gameService.syncLibraryFromSteam(steamid, apiKey).map(ResponseEntity::ok);
    }

    @GetMapping("/top3/{steamid}") // A diferencia del de arriba esta "puerta" lleva {}. A Java se le menciona que
                                   // dicha parte de la URL no será literal (nomás dinámica) y por lo tanto, se
                                   // debe usar @PathVariable.
    // Aquí no usé Mono porque no estoy llamando a la API sino a nuestra DB.
    /*
     * @PathVariable es lo mismo que @RequestParam pero para partes dinámicas de la
     * URL, también al ponerlo le damos a entender a Java que tiene que mirar el
     * steamid para extraer justamente lo marcado.
     */
    public ResponseEntity<List<Game>> getTop3(@PathVariable String steamid) {
        return ResponseEntity.ok(gameService.getTop3GamesBySteamId(steamid));
    }

    /**
     * Devuelve los top 5 géneros del usuario (porcentaje) a partir de su biblioteca.
     * El frontend lo usa para la gráfica de donut en el perfil.
     */
    @GetMapping("/top-genres/{steamid}")
    public ResponseEntity<List<com.equipo.backend.dto.GenrePercentageDTO>> getTopGenres(@PathVariable String steamid) {
        return ResponseEntity.ok(gameService.getTopGenresBySteamId(steamid));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Game>> getAllGames() {
        return ResponseEntity.ok(gameService.findAll());
    }
}
