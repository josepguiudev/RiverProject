package com.equipo.backend.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;

import com.equipo.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

public class AuthController {
    private final AuthService authService;

    // 🔥 ESTE CONSTRUCTOR ES LA CLAVE
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    //Sistema encriptado poner cualquiercosa en parámetro para ver su encriptacion
    @GetMapping("/test-password")
    public String testPassword() {
        return new BCryptPasswordEncoder().encode("12345678");
    }

}
