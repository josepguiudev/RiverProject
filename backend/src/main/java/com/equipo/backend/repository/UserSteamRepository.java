package com.equipo.backend.repository;

import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.equipo.backend.model.UserSteam;

@Repository
public interface UserSteamRepository extends JpaRepository<UserSteam, Long> {
    Optional<UserSteam> findBySteamid(String steamid);
}
