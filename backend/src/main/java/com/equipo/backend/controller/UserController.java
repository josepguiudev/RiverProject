package com.equipo.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.equipo.backend.model.User;
import com.equipo.backend.repository.UserRepository;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }


    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    /**
     * Obtener un usuario por su ID de la BD.
     * Ruta: GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Actualizar los datos de un usuario existente.
     * Ruta: PUT /api/users/{id}
     * 
     * Campos que se pueden actualizar: name, apellido1, apellido2, email,
     * edad, localizacion, urlIdStream (Steam ID).
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return userRepository.findById(id)
                .map(user -> {
                    if (updates.containsKey("name"))
                        user.setName((String) updates.get("name"));
                    if (updates.containsKey("apellido1"))
                        user.setApellido1((String) updates.get("apellido1"));
                    if (updates.containsKey("apellido2"))
                        user.setApellido2((String) updates.get("apellido2"));
                    if (updates.containsKey("email"))
                        user.setEmail((String) updates.get("email"));
                    if (updates.containsKey("edad"))
                        user.setEdad(Integer.valueOf(updates.get("edad").toString()));
                    if (updates.containsKey("localizacion"))
                        user.setLocalizacion((String) updates.get("localizacion"));
                    if (updates.containsKey("urlIdStream"))
                        user.setUrlIdStream((String) updates.get("urlIdStream"));

                    userRepository.save(user);
                    user.setPassword(null); // No devolver la contraseña
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private final WebClient webClient = WebClient.create();

    @GetMapping ("/userfromsteam")
    public Mono<Object> getPlayerSummaries(@RequestParam String steamId, @RequestParam String steamApiKey) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .scheme("https")
                    .host("api.steampowered.com")
                    .path("/ISteamUser/GetPlayerSummaries/v2/")
                    .queryParam("key", steamApiKey)
                    .queryParam("steamids", steamId)
                    .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnError(err -> {
                System.out.println("Error al llamar a Steam API: " + err.getMessage());
                });
    }

    @GetMapping ("/friendslist")
    public Mono<Object> getFriendList(@RequestParam String steamId, @RequestParam String steamApiKey) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .scheme("https")
                    .host("api.steampowered.com")
                    .path("/ISteamUser/GetFriendList/v1/")
                    .queryParam("key", steamApiKey)
                    .queryParam("steamid", steamId)
                    .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnError(err -> {
                System.out.println("Error al llamar a Steam API: " + err.getMessage());
                });
    }
    

}
