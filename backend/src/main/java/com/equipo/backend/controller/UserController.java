package com.equipo.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
