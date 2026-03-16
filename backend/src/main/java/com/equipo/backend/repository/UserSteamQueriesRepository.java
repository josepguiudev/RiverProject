package com.equipo.backend.repository;

import com.equipo.backend.model.UserSteamQueries;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSteamQueriesRepository extends JpaRepository<UserSteamQueries, Long> {
    // puedes agregar consultas personalizadas si quieres
    List<UserSteamQueries> findByType(int type);
}
