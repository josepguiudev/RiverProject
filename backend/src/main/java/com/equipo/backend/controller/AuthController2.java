package com.equipo.backend.controller;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.RegisterRequest;
import com.equipo.backend.service.AuthService2;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
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

    @PutMapping("/complete-profile/{id}")
    public ResponseEntity<?> completeProfile(@PathVariable Long id, @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService2.completeProfile(id, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Paso 3: Vincular Steam y activar encuestas
    @PutMapping("/complete-profile-steam/{id}") 
    public ResponseEntity<?> completeSteam(@PathVariable Long id, @RequestParam String steamId) {
        try {
            return ResponseEntity.ok(authService2.completeSteamRegistration(id, steamId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en el registro de Steam: " + e.getMessage());
        }
    }

    @GetMapping("/check-steam/{steamId}")
    public ResponseEntity<?> checkSteam(@PathVariable String steamId) {
        boolean exists = authService2.verifySteamIdExists(steamId);
        if (exists) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false); 
        }
    }
    
    @PostMapping("/assign-survey/{surveyId}")
    public ResponseEntity<?> assignSurvey(
            @PathVariable Long surveyId, 
            @RequestParam(required = false, defaultValue = "0") Integer limit) {
        
        authService2.assignSurveyToUsers(surveyId, limit);
        return ResponseEntity.ok().body("{\"message\": \"Encuesta asignada con éxito\"}");
    }

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

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
            try {
                String authHeader = request.getHeader("Authorization");
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
                }

                String token = authHeader.substring(7);
                // Llamamos al servicio siguiendo tu lógica
                return ResponseEntity.ok(authService2.getCurrentUser(token));
                
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            }
    }

}