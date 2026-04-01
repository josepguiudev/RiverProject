package com.equipo.backend.service;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;
import com.equipo.backend.dto.RegisterRequest;
import com.equipo.backend.model.Client;
import com.equipo.backend.model.User;
import com.equipo.backend.repository.ClientRepository;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService2 {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService2(UserRepository userRepository,
                        ClientRepository clientRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse register(RegisterRequest request) {
        // Validar si el email ya existe en cualquiera de las dos tablas
        if (userRepository.findByEmail(request.getEmail()).isPresent() || 
            clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        if ("CLIENT".equalsIgnoreCase(request.getType())) {
            // Flujo de CLIENTE
            Client client = new Client();
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setNombre(request.getName());
            client.setCuentaBancaria(request.getCuentaBancaria());
            client.setUrlImagen(request.getUrlImagen());
            
            clientRepository.save(client);
            
            String token = jwtService.generateTokenForClient(client); 
            client.setPassword(null);
            return new LoginResponse(token, client);

        } else {
            // Flujo de USUARIO
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setName(request.getName());
            user.setApellido1(request.getApellido1());
            user.setApellido2(request.getApellido2());
            user.setEdad(request.getEdad());
            user.setGenero(request.getGenero());
            user.setLocalizacion(request.getLocalizacion());
            user.setId_rol((byte) 1);
            user.setBanned((byte) 0);

            userRepository.save(user);

            String token = jwtService.generateToken(user);
            user.setPassword(null);
            return new LoginResponse(token, user);
        }
    }

    public LoginResponse login(LoginRequest request) {
        // Buscar en Usuarios
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            String token = jwtService.generateToken(user);
            user.setPassword(null);
            return new LoginResponse(token, user);
        }

        // Buscar en Clientes
        Optional<Client> clientOpt = clientRepository.findByEmail(request.getEmail());
        if (clientOpt.isPresent() && passwordEncoder.matches(request.getPassword(), clientOpt.get().getPassword())) {
            Client client = clientOpt.get();
            String token = jwtService.generateTokenForClient(client);
            client.setPassword(null);
            return new LoginResponse(token, client);
        }

        throw new RuntimeException("Credenciales incorrectas");
    }
}