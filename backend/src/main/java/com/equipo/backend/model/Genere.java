package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "genere")
@Data
public class Genere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreGenero;

    @ManyToMany(mappedBy = "generes")
    private List<Game> gamesList = new ArrayList<>();

    @ManyToMany(mappedBy = "generes")
    private List<Survey> surveyList = new ArrayList<>();


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreGenero() {
        return this.nombreGenero;
    }

    public void setNombreGenero(String nombreGenero) {
        this.nombreGenero = nombreGenero;
    }


    public List<Game> getGamesList() {
        return this.gamesList;
    }

    public void setGamesList(List<Game> gamesList) {
        this.gamesList = gamesList;
    }

    public List<Survey> getSurveyList() {
        return this.surveyList;
    }

    public void setSurveyList(List<Survey> surveyList) {
        this.surveyList = surveyList;
    }


    public Genere() {
    }


    public Genere(Long id, String nombreGenero, List<Game> gamesList, List<Survey> surveyList) {
        this.id = id;
        this.nombreGenero = nombreGenero;
        this.gamesList = gamesList;
        this.surveyList = surveyList;
    }



}
