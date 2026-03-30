package com.equipo.backend.service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.equipo.backend.model.Game;
import com.equipo.backend.model.Genere;
import com.equipo.backend.repository.GenereRepository;

import jakarta.transaction.Transactional;

@Service
public class GenereService {
    @Autowired
    private GenereRepository genereRepository;

    @Autowired // <--- AÑADE ESTO
    private com.equipo.backend.repository.GameSteamRepository gameRepository; 

    @Transactional
    public void saveGameDetailsAndGenres(Map<String, Object> steamResponse) {
        // Extraer id juego
        String appidStr = steamResponse.keySet().iterator().next();
        @SuppressWarnings("unchecked")
        Map<String, Object> root = (Map<String, Object>) steamResponse.get(appidStr);
        
        if (root == null || !(boolean) root.get("success")) {
            throw new RuntimeException("Error: Steam no devolvió éxito.");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) root.get("data");
        Long appid = Long.valueOf(data.get("steam_appid").toString());

        // 2. Buscar el juego base (ya debe estar en tu tabla 'game')
        Game game = gameRepository.findByAppid(appid)
            .orElseThrow(() -> new RuntimeException("El juego " + appid + " no existe. Regístralo primero."));

        // 3. Procesar géneros
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> genresRaw = (List<Map<String, Object>>) data.get("genres");
        List<Genere> fullGenreList = new ArrayList<>();

        if (genresRaw != null) {
            for (Map<String, Object> g : genresRaw) {
                String desc = (String) g.get("description");
                
                // Buscar o Crear el género
                Genere genre = genereRepository.findByDescription(desc)
                    .orElseGet(() -> {
                        Genere newG = new Genere();
                        newG.setDescription(desc);
                        return genereRepository.save(newG);
                    });
                fullGenreList.add(genre);
            }
        }

        // 4. Actualizar relación N:M (JPA inserta en 'game_generes')
        game.setGenereList(fullGenreList);
        gameRepository.save(game);
    }
}