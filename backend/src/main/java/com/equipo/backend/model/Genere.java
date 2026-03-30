package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "genere")
@Data
public class Genere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_genere")
    private Long id;    

    @Column(unique = true)
    private String description;

    @ManyToMany(mappedBy = "genereList")
    private List<Game> games = new ArrayList<>();

    @ManyToMany(mappedBy = "genereList")
    @JsonIgnore
    private List<Survey> surveyList = new ArrayList<>();

    public List<Game> getGames() {
        return this.games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    public String getNombreGenero() {
        return this.nombreGenero;
    }

    public void setNombreGenero(String nombreGenero) {
        this.nombreGenero = nombreGenero;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



}
