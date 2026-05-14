package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    //@ManyToMany(mappedBy = "genereList")
    //@JsonIgnore
    @ManyToMany(mappedBy = "genereList", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("genereList") // Permite enviar los juegos ocultando solo el bucle inverso
    private List<Game> games = new ArrayList<>();

    @ManyToMany(mappedBy = "genereList")
    @JsonIgnore
    private List<Survey> surveyList = new ArrayList<>();


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Game> getGames() {
        return this.games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    public List<Survey> getSurveyList() {
        return this.surveyList;
    }

    public void setSurveyList(List<Survey> surveyList) {
        this.surveyList = surveyList;
    }


    public Genere() {
    }


    public Genere(Long id, String description, List<Game> games, List<Survey> surveyList) {
        this.id = id;
        this.description = description;
        this.games = games;
        this.surveyList = surveyList;
    }


}
