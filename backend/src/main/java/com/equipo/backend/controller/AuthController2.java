package com.equipo.backend.controller;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.RegisterRequest;
import com.equipo.backend.service.AuthService2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth2")
@CrossOrigin(origins = "*")
public class AuthController2 {

    private final AuthService2 authService2;

    public AuthController2(AuthService2 authService2) {
        this.authService2 = authService2;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService2.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService2.register(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Cambiar la contraseña de un usuario.
     * Ruta: PUT /api/auth2/change-password
     * 
     * Body esperado: { "userId": 1, "currentPassword": "...", "newPassword": "..." }
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            String currentPassword = (String) body.get("currentPassword");
            String newPassword = (String) body.get("newPassword");

            authService2.changePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(java.util.Map.of("message", "Contraseña actualizada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}