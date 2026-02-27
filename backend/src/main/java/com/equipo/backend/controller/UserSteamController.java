package com.equipo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.equipo.backend.dto.UserSteamRequest;
import com.equipo.backend.service.UserSteamService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/usersteam")
@CrossOrigin(origins = "*")

public class UserSteamController {
    private final UserSteamService userSteamService;
    
    public UserSteamController(UserSteamService userSteamService){
        this.userSteamService = userSteamService;
    }

    @PostMapping("/registerusersteam")
    public ResponseEntity<?> register(@RequestBody UserSteamRequest request) {
        userSteamService.register(request);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }
}
