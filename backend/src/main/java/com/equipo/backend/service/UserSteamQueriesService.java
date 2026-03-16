package com.equipo.backend.service;

import com.equipo.backend.model.UserSteamQueries;
import com.equipo.backend.repository.UserSteamQueriesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserSteamQueriesService {
    @Autowired
    private UserSteamQueriesRepository repository;

    public UserSteamQueriesService(UserSteamQueriesRepository repository) {
        this.repository = repository;
    }

    public List<UserSteamQueries> obtenerTodasQueries() {
        return repository.findAll();
    }

    public List<UserSteamQueries> obtenerQueriesPorTipo(int tipo) {
        return repository.findByType(tipo);
    }
}
