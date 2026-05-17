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


    @Value("${steam.api.baseurl:https://api.steampowered.com}")
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

        // 2. Switch por tipo para crear la entidad
        return switch (request.getType().toUpperCase()) {
            case "PLAYER" -> {
                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setName(request.getName());
                user.setId_rol((byte) 1);
                user.setRegistrationStep(1);
                user.setCreacionCuentaUsuario(new Date());
                
                userRepository.save(user);
                yield new LoginResponse(jwtService.generateToken(user), user, "PLAYER", 1);
            }
            case "CLIENT" -> {
                Client client = new Client();
                client.setEmail(request.getEmail());
                client.setPassword(passwordEncoder.encode(request.getPassword()));
                client.setNombre(request.getName());
                client.setCuentaBancaria(request.getCuentaBancaria());
                
                clientRepository.save(client);
                yield new LoginResponse(jwtService.generateTokenForClient(client), client, "CLIENT", 3);
            }
            default -> throw new RuntimeException("Tipo de cuenta no soportado");
        };
    }

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        Optional<Client> clientOpt = clientRepository.findByEmail(request.getEmail());

        String role = "NONE";
        if (userOpt.isPresent()) role = "PLAYER";
        else if (clientOpt.isPresent()) role = "CLIENT";

        switch (role) {
            case "PLAYER":
                User user = userOpt.get();
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    throw new RuntimeException("Credenciales incorrectas");
                }
                return new LoginResponse(jwtService.generateToken(user), user, "PLAYER", user.getRegistrationStep());

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

     //PASO 3: Finalizar con Steam y asignar encuestas
    @Transactional
    public User completeSteamRegistration(Long userId, String steamId) {
        
    // Sacamos la base (Type 0)
    String baseDesdeDb = queriesRepository.findByType(0).stream()
            .filter(q -> q.getQuery().contains("ISteamUser"))
            .findFirst()
            .map(UserSteamQueries::getQuery)
            .orElse(steamBaseUrl + "/ISteamUser/");

    // Sacamos el endpoint (Type 1)
    String playerSummaryEndpoint = queriesRepository.findByType(1).stream()
            .filter(q -> q.getQuery().contains("GetPlayerSummaries"))
            .findFirst()
            .map(UserSteamQueries::getQuery)
            .orElse("GetPlayerSummaries/v2/");

    // Sumamos las dos piezas de la DB
    String finalUrl = baseDesdeDb + playerSummaryEndpoint + "?key=" + steamApiKey + "&steamids=" + steamId;


        try {
            // 3. Validamos contra Steam
            Map<String, Object> response = restTemplate.getForObject(finalUrl, Map.class);
            
            // Navegamos por el JSON de respuesta de Steam: response -> players -> [0]
            Map<?, ?> responseBody = (Map<?, ?>) response.get("response");
            List<?> players = (List<?>) responseBody.get("players");

            if (players == null || players.isEmpty()) {
                throw new RuntimeException("El ID de Steam no existe o el perfil es privado.");
            }

            // 4. Si es válido, actualizamos el usuario en nuestra DB
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la base de datos"));

            user.setUrlIdStream(steamId);
            user.setRegistrationStep(3); // Marcamos que ha completado el registro
            
            User savedUser = userRepository.save(user);
            
            // 5. Disparamos la lógica para asignarle encuestas basadas en su perfil
            asignarEncuestasDisponibles(savedUser);

            return savedUser;

        } catch (Exception e) {
            throw new RuntimeException("Error en la validación de Steam: " + e.getMessage());
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

   public boolean verifySteamIdExists(String steamId) {
        try {
            // Usamos las piezas de la DB para ser coherentes con el resto del service
            String playerSummaryEndpoint = queriesRepository.findByType(1).stream()
                    .filter(q -> q.getQuery().contains("GetPlayerSummaries"))
                    .findFirst()
                    .map(UserSteamQueries::getQuery)
                    .orElse("ISteamUser/GetPlayerSummaries/v2/");

            String url = steamBaseUrl + "/" + playerSummaryEndpoint + "?key=" + steamApiKey + "&steamids=" + steamId;
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            Map<?, ?> responseBody = (Map<?, ?>) response.get("response");
            List<?> players = (List<?>) responseBody.get("players");
            return players != null && !players.isEmpty();
        } catch (Exception e) {
            return false;
        }
        
    }

    /**
     * Cambia la contraseña de un usuario.
     * Valida la contraseña actual antes de actualizar.
     */
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

}