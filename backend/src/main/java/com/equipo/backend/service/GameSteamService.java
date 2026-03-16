package com.equipo.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.equipo.backend.dto.GameSteamRequest;
import com.equipo.backend.model.Game;
import com.equipo.backend.repository.GameSteamRepository;

@Service
public class GameSteamService {
    @Autowired
    private GameSteamRepository gameRepository;

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
}
