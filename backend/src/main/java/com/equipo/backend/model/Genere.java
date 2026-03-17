package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "genere")
public class Genere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_genere;

    @Column(unique = true)
    private String description;

    @ManyToMany(mappedBy = "genereList")
    private List<Game> games = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_survey")
    private Survey survey;

    public List<Game> getGames() {
        return this.games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    public Long getId_genere() {
        return this.id_genere;
    }

    public void setId_genere(Long id_genere) {
        this.id_genere = id_genere;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}
