package com.equipo.backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.repository.UserSteamRepository;
import com.equipo.backend.service.GameSteamService;

// import jakarta.annotation.PostConstruct; // PARA TESTEAR si funciona esta clase

import org.springframework.beans.factory.annotation.Value;

@Component
public class SteamScheduler {

    @Autowired
    private GameSteamService gameService;

    @Autowired
    private UserSteamRepository userSteamRepository;

    // Leo la API Key del archivo application.yml y lo guardo.
    @Value("${spring.steam.api.key}")
    private String steamApiKey;

    // Cada domingo a las 3:00 AM
    @Scheduled(cron = "0 0 3 * * SUN") // El formato es: segundo minuto hora día-del-mes mes día-de-la-semana
    public void resyncAllLibraries() {
        List<UserSteam> allUsers = userSteamRepository.findAll();

        for (UserSteam user : allUsers) {
            try {
                gameService.clearAndResyncLibrary(
                        user.getSteamid(),
                        steamApiKey).block(); // Se usa aquí y no allá porque el scheduler no devuelve Mono así que aquí
                                              // puedo bloquear esperando a que termine la transacción y poder continuar
                                              // con el siguiente usuario. Relacionado con la función de
                                              // GameSteamService (syncLibraryFromSteam).
                System.out.println("Resincronizado: " + user.getSteamid());
            } catch (Exception e) {
                // Si un usuario falla, el resto siguen procesándose
                System.err.println("Error resincronizando " + user.getSteamid() + ": " + e.getMessage());
            }
        }
    }

    // @PostConstruct
    // public void testRunOnStartup() {
    // System.out.println("Forzando ejecución del Scheduler al
    // arrancar...");
    // resyncAllLibraries();
    // }
}