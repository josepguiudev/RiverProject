package com.equipo.backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.equipo.backend.model.Genere;

public interface GenereRepository extends JpaRepository<Genere, Long> {
    Optional<Genere> findByDescription(String description);
}
