package com.equipo.backend.repository;

import org.springframework.stereotype.Repository;
import com.equipo.backend.model.Game;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface GameSteamRepository extends JpaRepository<Game, Long>{
    List<Game> findAllByAppidIn(List<Long> appids);
    Optional<Game> findByAppid(Long appid);
}
