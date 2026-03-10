package com.equipo.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;
import com.equipo.backend.dto.RegisterRequest;
import com.equipo.backend.model.User;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.security.JwtService;

@Service
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

    public LoginResponse register(RegisterRequest request) {
        // --- EL DEBUG VA AQUÍ ---
        System.out.println("--- DATOS RECIBIDOS DESDE EL MOVIL ---");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Nombre: " + request.getName());
        System.out.println("Edad: " + request.getEdad());
        System.out.println("Genero: " + request.getGenero());
        System.out.println("Localizacion: " + request.getLocalizacion());
        System.out.println("-------------------------------------");
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setId_rol((byte) 1);
        user.setEdad(request.getEdad());
        user.setGenero(request.getGenero());
        user.setLocalizacion(request.getLocalizacion());

        userRepository.save(user);
        
        String token = jwtService.generateToken(user);
        return new LoginResponse(token);
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