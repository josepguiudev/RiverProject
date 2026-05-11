package com.equipo.backend.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;
import com.equipo.backend.dto.RegisterRequest;
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

    //Ruta para log de users
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    //Ruta para crear users
  @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // 🕵️ CAZADOR DE ERRORES: Captura errores de conversión de JSON a Objeto
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleJsonErrors(HttpMessageNotReadableException ex) {
        System.out.println("❌ ERROR DE JSON EN SPRING BOOT: " + ex.getMessage());
        return ResponseEntity.badRequest().body("Error de formato en Spring Boot: " + ex.getMostSpecificCause().getMessage());
    }

    //Sistema encriptado poner cualquier cosa en parámetro para ver su encriptacion
    @GetMapping("/test-password")
    public String testPassword() {
        return new BCryptPasswordEncoder().encode("12345678");
    }

}
