package com.equipo.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "category")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    
    @ManyToOne
    @JoinColumn(name = "id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "id")
    private Survey survey;


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


    public Game getGame() {
        return this.game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public Category() {
    }


    public Category(Long id, String description, Game game, Survey survey) {
        this.id = id;
        this.description = description;
        this.game = game;
        this.survey = survey;
    }


}
