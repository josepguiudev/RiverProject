package com.equipo.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.equipo.backend.dto.UserSteamRequest;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.service.UserSteamService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

    @PostMapping("/register-multiple")
    public ResponseEntity<?> registerMultiple(@RequestBody List<UserSteamRequest> requests) {
        userSteamService.registerAll(requests);
        return ResponseEntity.ok("Usuarios procesados correctamente");
    }

    @GetMapping("/allUsers") //-> Necesitamos crear en el servicio los métodos de extracción de los usuarios
    public ResponseEntity<List<UserSteam>> getAll() {
        List<UserSteam> users = userSteamService.getAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/by-bd-id/{id}")
    public ResponseEntity<UserSteam> getById(@PathVariable Long id) {
        UserSteam user = userSteamService.getById(id);
        return ResponseEntity.ok(user);
    }

    /*@GetMapping("/by-bd-steamid/{id}")
    public ResponseEntity<UserSteam> getBySteamId(@PathVariable Long id) {
        UserSteam user = userSteamService.getById(id);
        return ResponseEntity.ok(user);
    }*/
    
    @PutMapping("/up-by-bd-id/{id}")
    public ResponseEntity<UserSteam> update(@PathVariable Long id, @RequestBody UserSteamRequest request) {
        UserSteam updated = userSteamService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/del-by-bd-id/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        userSteamService.delete(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

}
