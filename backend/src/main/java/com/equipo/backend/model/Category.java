package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "category")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_category")
    private Long id;

    private String description;
    
    @ManyToMany(mappedBy = "categoryList")
    @ToString.Exclude
    @JsonIgnore
    private List<Game> gamesList = new ArrayList<>();

    @ManyToMany(mappedBy = "categoryList")
    @ToString.Exclude
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


    public Category() {
    }


    public Category(Long id, String description, List<Game> gamesList, List<Survey> surveyList) {
        this.id = id;
        this.description = description;
        this.gamesList = gamesList;
        this.surveyList = surveyList;
    }


}
