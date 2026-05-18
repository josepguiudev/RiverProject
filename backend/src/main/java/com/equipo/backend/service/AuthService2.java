package com.equipo.backend.service;

import com.equipo.backend.dto.LoginRequest;
import com.equipo.backend.dto.LoginResponse;
import com.equipo.backend.dto.RegisterRequest;
import com.equipo.backend.model.*;
import com.equipo.backend.repository.*;
import com.equipo.backend.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import jakarta.persistence.EntityManager;

import java.util.Date; // IMPORTANTE: Corrige el error "Date cannot be resolved"
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService2 {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final SurveyRepository surveyRepository; // Inyectado para la asignación
    private final UserSurveysRepository userSurveysRepository; // Para la tabla intermedia
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Value("${steam.api.baseurl:https://api.steampowered.com/ISteamUser}")
    private String steamBaseUrl;

    // Aquí es obligatorio que esté en el YAML o fallará
    @Value("${steam.api.key}")
    private String steamApiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserSteamQueriesRepository queriesRepository;
    
    public AuthService2(UserRepository userRepository,
                        ClientRepository clientRepository,
                        SurveyRepository surveyRepository,
                        UserSurveysRepository userSurveysRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        UserSteamQueriesRepository queriesRepository,
                        RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.surveyRepository = surveyRepository;
        this.userSurveysRepository = userSurveysRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.queriesRepository = queriesRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // 1. Validación común
        if (userRepository.findByEmail(request.getEmail()).isPresent() || 
            clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // 2. Switch modificado para aceptar múltiples variantes
        return switch (request.getType().toUpperCase()) {
            // Al añadir una coma, ambas palabras clave ejecutarán el mismo código
            case "PLAYER", "USER" -> {
                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setName(request.getName());
                user.setId_rol((byte) 0);
                user.setRegistrationStep(1);
                user.setCreacionCuentaUsuario(new Date());
                
                userRepository.save(user);
                // IMPORTANTE: Sigues devolviendo "PLAYER" en el DTO de respuesta 
                // para no romper la lógica interna de roles del resto de la app
                yield new LoginResponse(jwtService.generateToken(user), user, "PLAYER", 1);
            }
            case "CLIENT", "EMPRESA" -> {
                Client client = new Client();
                client.setEmail(request.getEmail());
                client.setPassword(passwordEncoder.encode(request.getPassword()));
                client.setNombre(request.getName());
                client.setCuentaBancaria(request.getCuentaBancaria());
                
                clientRepository.save(client);
                yield new LoginResponse(jwtService.generateTokenForClient(client), client, "CLIENT", 3);
            }
            default -> throw new RuntimeException("Tipo de cuenta no soportado: " + request.getType());
        };
    }
    
    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        Optional<Client> clientOpt = clientRepository.findByEmail(request.getEmail());

        String role = "NONE";
        if (userOpt.isPresent()) {
            // Si está en la tabla User, verificamos si es ADMIN por su id_rol
            User u = userOpt.get();
            role = (u.getId_rol() != null && u.getId_rol() == 1) ? "ADMIN" : "PLAYER";
        } else if (clientOpt.isPresent()) {
            role = "CLIENT";
        }

        switch (role) {
            case "ADMIN":
            case "PLAYER":
                User user = userOpt.get();
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    throw new RuntimeException("Credenciales incorrectas");
                }
                // Devolvemos el rol explícito ("ADMIN" o "PLAYER")
                return new LoginResponse(jwtService.generateToken(user), user, role, user.getRegistrationStep());

            case "CLIENT":
                Client client = clientOpt.get();
                if (!passwordEncoder.matches(request.getPassword(), client.getPassword())) {
                    throw new RuntimeException("Credenciales incorrectas");
                }
                return new LoginResponse(jwtService.generateTokenForClient(client), client, "CLIENT", 3);

            default:
                throw new RuntimeException("Usuario no encontrado");
        }
    }
    
    // PASO 2: Completar perfil
    public User completeProfile(Long userId, RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setApellido1(request.getApellido1());
        user.setApellido2(request.getApellido2());
        user.setEdad(request.getEdad());
        user.setGenero(request.getGenero());
        user.setLocalizacion(request.getLocalizacion());
        user.setRegistrationStep(2); 

        User savedUser = userRepository.save(user);
        asignarEncuestasDisponibles(savedUser);

        return userRepository.save(user);
    }

    // PASO 3: Finalizar con Steam y asignar encuestas
    @Transactional
    public User completeSteamRegistration(Long userId, String steamId) {
        // 1. Llamamos al método de validación
        boolean exists = verifySteamIdExists(steamId);

        if (!exists) {
            throw new RuntimeException("El ID de Steam no es válido, no existe o el perfil es privado.");
        }

        // 2. Si existe, buscamos al usuario en nuestra DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));

        // 3. Actualizamos los datos del usuario
        user.setUrlIdStream(steamId);
        user.setRegistrationStep(3); // Registro completado
        
        User savedUser = userRepository.save(user);
        
        // 4. Disparamos la lógica para asignarle encuestas
        asignarEncuestasDisponibles(savedUser);

        return savedUser;
    }

    // MÉTODO DE APOYO: Solo valida contra la API de Steam
    public boolean verifySteamIdExists(String steamId) {
        try {
            // Construimos la URL completa manualmente para evitar errores de 404
            // IMPORTANTE: Mantenemos la estructura exacta que Steam requiere
            String url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/" 
                        + "?key=" + steamApiKey 
                        + "&steamids=" + steamId;
            
            System.out.println("DEBUG - Validando en Steam: " + url);

            // Realizamos la petición
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null || !response.containsKey("response")) {
                return false;
            }

            Map<?, ?> responseBody = (Map<?, ?>) response.get("response");
            List<?> players = (List<?>) responseBody.get("players");
            
            // Steam devuelve una lista vacía si el ID no existe
            return players != null && !players.isEmpty();

        } catch (Exception e) {
            System.err.println("Error en la llamada física a Steam: " + e.getMessage());
            return false;
        }
    }

    private void asignarEncuestasDisponibles(User user) {
        List<Survey> allSurveys = surveyRepository.findAll();
        
        List<UserSurveys> assignments = allSurveys.stream().map(survey -> {
            UserSurveys rel = new UserSurveys();
            rel.setUser(user);
            rel.setSurvey(survey);
            rel.setIsRespondida((byte) 0);
            return rel;
        }).collect(Collectors.toList());

        userSurveysRepository.saveAll(assignments);
    }

   @Transactional
    public void assignSurveyToUsers(Long surveyId, Integer limit) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        List<User> eligibleUsers = userRepository.findUsersNotAssignedToSurvey(surveyId);

        if (eligibleUsers.isEmpty()) {
            return;
        }

        int toAssignCount = (limit != null && limit > 0) 
                            ? Math.min(limit, eligibleUsers.size()) 
                            : eligibleUsers.size();

        List<User> selectedUsers = eligibleUsers.subList(0, toAssignCount);

        List<UserSurveys> newAssignments = selectedUsers.stream().map(user -> {
            UserSurveys rel = new UserSurveys();
            rel.setUser(user);
            rel.setSurvey(survey);
            rel.setIsRespondida((byte) 0);
            return rel;
        }).collect(Collectors.toList());

        userSurveysRepository.saveAll(newAssignments);
    }

    public LoginResponse getCurrentUser(String token) {
        String email = jwtService.extractUsername(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Validación id_rol = 1 para ADMIN
            String role = (user.getId_rol() != null && user.getId_rol() == 1) ? "ADMIN" : "PLAYER";
            return new LoginResponse(token, user, role, user.getRegistrationStep());
        }

        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            return new LoginResponse(token, client, "CLIENT", 3);
        }

        throw new RuntimeException("Usuario no encontrado con el token proporcionado");
    }

        public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Codificar y guardar la nueva contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}