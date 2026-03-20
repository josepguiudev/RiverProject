package com.equipo.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.equipo.backend.dto.GameSteamFrontDTO;
import com.equipo.backend.dto.UserSteamFrontDTO;
import com.equipo.backend.dto.UserSteamRequest;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.repository.UserSteamRepository;
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

    @Autowired
    private UserSteamRepository userSteamRepository;
    @GetMapping("/allUsers") //-> Necesitamos crear en el servicio los métodos de extracción de los usuarios
    public List<UserSteamFrontDTO> getAllUsers() {
        List<UserSteam> users = userSteamRepository.findAll();

        return users.stream().map(user -> {
            UserSteamFrontDTO dto = new UserSteamFrontDTO();
            dto.setId(user.getId());
            dto.setPersonaName(user.getPersonaName());
            dto.setSteamId(user.getSteamId());
            dto.setAvatar(user.getAvatar());
            dto.setProfileUrl(user.getProfileUrl());

            List<GameSteamFrontDTO> games = user.getGames().stream().map(game -> {
                GameSteamFrontDTO g = new GameSteamFrontDTO();
                g.setId_game(game.getId_game());
                g.setAppid(game.getAppid());
                g.setTitle(game.getTitle());
                g.setIconUrl(game.getIconUrl());
                return g;
            }).collect(Collectors.toList());

            dto.setGames(games);
            return dto;
        }).collect(Collectors.toList());
    }
    /*public ResponseEntity<List<UserSteam>> getAll() {
        List<UserSteam> users = userSteamService.getAll();
        return ResponseEntity.ok(users);
    }*/

    @GetMapping("/by-bd-id/{id}")
    public ResponseEntity<UserSteam> getById(@PathVariable Long id) {
        UserSteam user = userSteamService.getById(id);
        return ResponseEntity.ok(user);
    }
   

    @GetMapping("/by-bd-steamid/{steamid}")
    public ResponseEntity<UserSteam> getBySteamId(@PathVariable("steamid") String steamid) {
        UserSteam user = userSteamService.getBySteamId(steamid);
        return ResponseEntity.ok(user);
    }
    
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
