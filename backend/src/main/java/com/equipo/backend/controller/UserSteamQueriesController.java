package com.equipo.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.equipo.backend.model.UserSteamQueries;
import com.equipo.backend.service.UserSteamQueriesService;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "*")

public class UserSteamQueriesController {
    @Autowired
    private final UserSteamQueriesService userSteamQueriesService;

    public UserSteamQueriesController(UserSteamQueriesService userSteamQueriesService) {
        this.userSteamQueriesService = userSteamQueriesService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserSteamQueries>> getAllResponses() {
        try {
            List<UserSteamQueries> users = userSteamQueriesService.obtenerTodasQueries();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/bytype1")
    public ResponseEntity<List<UserSteamQueries>> getType1Responses() {
        try {
            List<UserSteamQueries> users = userSteamQueriesService.obtenerQueriesPorTipo(1);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/bytype2")
    public ResponseEntity<List<UserSteamQueries>> getType2Responses() {
        try {
            List<UserSteamQueries> users = userSteamQueriesService.obtenerQueriesPorTipo(2);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/bytype3")
    public ResponseEntity<List<UserSteamQueries>> getType3Responses() {
        try {
            List<UserSteamQueries> users = userSteamQueriesService.obtenerQueriesPorTipo(3);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
