package com.equipo.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.equipo.backend.dto.GameSteamRequest;
import com.equipo.backend.dto.GenrePercentageDTO;
import com.equipo.backend.dto.SteamApiResponse;
import com.equipo.backend.model.Game;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.repository.GameSteamRepository;
import com.equipo.backend.repository.UserSteamRepository;

import jakarta.transaction.Transactional;
import reactor.core.publisher.Mono;

@Service
public class GameSteamService {
    @Autowired
    private GameSteamRepository gameRepository;

    @Autowired
    private UserSteamRepository userSteamRepository; // <--- inyectar esto para la n:m

    @Transactional
    public void saveLibraryAndLinkToUser(String steamid, List<GameSteamRequest> requests) {

        UserSteam user = userSteamRepository.findBySteamid(steamid)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + steamid));

        registerMultipleGames(requests);

        List<Long> appids = requests.stream().map(GameSteamRequest::getAppid).collect(Collectors.toList());
        List<Game> gamesInDb = gameRepository.findAllByAppidIn(appids);

        // Actualizamos la lista del usuario (JPA escribe en 'user_steam_games')
        user.setGames(gamesInDb);
        userSteamRepository.save(user);
    }

    public Game registerGame(GameSteamRequest request) {
        // Verificar si el juego ya existe para no duplicar
        return gameRepository.findByAppid(request.getAppid())
                .orElseGet(() -> {
                    Game newGame = new Game();
                    newGame.setAppid(request.getAppid());
                    newGame.setTitle(request.getName());
                    newGame.setIconUrl(request.getImg_icon_url());
                    // Por defecto ponemos 0
                    newGame.setIsEarlyAcces((byte) 0);
                    return gameRepository.save(newGame);
                });
    }

    public List<Game> registerMultipleGames(List<GameSteamRequest> requests) {
        // 1. Extraer los IDs como Long directamente desde el Request
        List<Long> incomingAppids = requests.stream()
                .map(GameSteamRequest::getAppid) // Esto ya devuelve Long
                .collect(Collectors.toList());

        // 2. Buscar en la BD (ahora el método acepta List<Long>)
        // Y guardamos los resultados en una lista de Long para comparar
        List<Long> existingAppids = gameRepository.findAllByAppidIn(incomingAppids)
                .stream()
                .map(Game::getAppid) // Esto devuelve Long si tu entidad está bien definida
                .collect(Collectors.toList());

        // 3. Filtrar comparando Long con Long
        List<Game> newGames = requests.stream()
                .filter(req -> !existingAppids.contains(req.getAppid()))
                .map(req -> {
                    Game g = new Game();
                    g.setAppid(req.getAppid());
                    g.setTitle(req.getName());
                    g.setIconUrl(req.getImg_icon_url());
                    g.setIsEarlyAcces((byte) 0);
                    return g;
                })
                .collect(Collectors.toList());

        // 3. Guardar todos los nuevos en un solo paso
        if (!newGames.isEmpty()) {
            return gameRepository.saveAll(newGames);
        }

        return new java.util.ArrayList<>();
    }

    public Game update(Long id, Game updatedGame) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        game.setTitle(updatedGame.getTitle());
        game.setIconUrl(updatedGame.getIconUrl());

        return gameRepository.save(game);
    }

    public void delete(Long id) {
        gameRepository.deleteById(id);
    }

    // Llama a Steam, mapea la respuesta y llama a saveLibraryAndLinkToUser.
    public Mono<String> syncLibraryFromSteam(String steamid, String apiKey) { // Cuando un endpoint en Controller
                                                                              // devuelve
                                                                              // MONO se activa solo esperando el
                                                                              // resultado para mostrarse como respuesta
                                                                              // HTTP.
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
                .bodyToMono(SteamApiResponse.class)
                .map(steamResponse -> {
                    // Mando datos de Steam a nuestros DTOs internos
                    List<GameSteamRequest> requests = steamResponse.getResponse()
                            .getGames()
                            .stream()
                            .map(game -> {
                                GameSteamRequest dto = new GameSteamRequest();
                                dto.setAppid(game.getAppid());
                                dto.setName(game.getName());
                                dto.setImg_icon_url(game.getImg_icon_url());
                                return dto;
                            })
                            .collect(Collectors.toList());

                    // Llamo método de Pepe
                    saveLibraryAndLinkToUser(steamid, requests);

                    return "Sincronizados " + requests.size() + " juegos para steamid: " + steamid;
                })
                .onErrorResume(e -> Mono.just(
                        "Error al conectar con Steam: " + e.getMessage()));
    }

    /**
     * Devuelve los 3 juegos vinculados al usuario desde la BD propia.
     * No llama a Steam — trabaja con lo que ya está guardado.
     */
    public List<Game> getTop3GamesBySteamId(String steamid) {
        UserSteam user = userSteamRepository.findBySteamid(steamid)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + steamid));

        return user.getGames()
                .stream()
                .limit(3)
                .collect(Collectors.toList());
    }

    // Eliminación y resincronización de la librería del usuario (top 3 juegos) en 2
    // pasos para
    // evitar usar .block (Se ve que en ciertos casos causa deadlock (bloqueo mutuo
    // entre diferentes transacciones activas))

    // Paso 1: Solo limpia la relación (transaccional)
    @Transactional
    public void clearUserLibrary(String steamid) {
        UserSteam user = userSteamRepository.findBySteamid(steamid)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + steamid));
        user.getGames().clear();
        userSteamRepository.save(user);
    }

    // Paso 2:Unión del paso 1 (limpieza) con sincronización (paso 2)
    public Mono<String> clearAndResyncLibrary(String steamid, String apiKey) {
        clearUserLibrary(steamid); // transacción
        return syncLibraryFromSteam(steamid, apiKey); // sincronización
    }

    /**
     * Devuelve los top 5 géneros del usuario (como porcentaje) a partir de los juegos
     * vinculados en la BD. Si hay más de 5 géneros, agrupa el resto en "Otros".
     */
    public List<GenrePercentageDTO> getTopGenresBySteamId(String steamid) {
        UserSteam user = userSteamRepository.findBySteamid(steamid)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + steamid));

        List<Game> allGames = user.getGames();

        // Contamos cuántas veces aparece cada género
        Map<String, Integer> genreCount = new HashMap<>();
        int totalGenreEntries = 0;

        for (Game game : allGames) {
            for (com.equipo.backend.model.Genere genere : game.getGenereList()) {
                String name = genere.getDescription();
                genreCount.put(name, genreCount.getOrDefault(name, 0) + 1);
                totalGenreEntries++;
            }
        }

        if (totalGenreEntries == 0) {
            return new java.util.ArrayList<>();
        }

        // Ordenamos de mayor a menor
        final int total = totalGenreEntries;
        List<Map.Entry<String, Integer>> sorted = genreCount.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toList());

        // Top 5 + Otros
        List<GenrePercentageDTO> result = new java.util.ArrayList<>();
        int accumulatedPercentage = 0;

        for (int i = 0; i < Math.min(5, sorted.size()); i++) {
            Map.Entry<String, Integer> entry = sorted.get(i);
            int pct = (int) Math.round((entry.getValue() * 100.0) / total);
            accumulatedPercentage += pct;
            result.add(new GenrePercentageDTO(entry.getKey(), pct));
        }

        // Si hay más de 5, agrupamos el resto
        if (sorted.size() > 5) {
            result.add(new GenrePercentageDTO("Otros", 100 - accumulatedPercentage));
        }

        return result;
    }
}