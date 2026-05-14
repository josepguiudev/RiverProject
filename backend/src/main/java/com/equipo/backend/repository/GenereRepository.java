package com.equipo.backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Map;
import com.equipo.backend.model.Genere;

public interface GenereRepository extends JpaRepository<Genere, Long> {
    Optional<Genere> findByDescription(String description);
    
    @Query(value = "SELECT g.id_genere as genereId, " +
                   "COUNT(DISTINCT ug.user_steam_id) as playerCount, " +
                   "GROUP_CONCAT(DISTINCT u.avatarfull SEPARATOR ',') as avatares " +
                   "FROM genere g " +
                   "LEFT JOIN game_generes gg ON g.id_genere = gg.id_genere " +
                   "LEFT JOIN user_steam_games ug ON gg.id_game = ug.id_game " +
                   "LEFT JOIN user_steam u ON ug.user_steam_id = u.id_user_steam " + // 👈 Mapeado simétrico a id_user_steam de UserSteam
                   "GROUP BY g.id_genere", nativeQuery = true)
    List<Map<String, Object>> countAndAvatarsPerGenere();
}
