package com.equipo.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;
import com.equipo.backend.model.User;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.security.JwtService;

public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token);
    }
}
