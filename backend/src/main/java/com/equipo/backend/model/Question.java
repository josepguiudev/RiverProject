package com.equipo.backend.model;


import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "question")
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String textQuestion;
        
    @ManyToOne
    @JoinColumn(name = "id_survey")
    @JsonBackReference
    private Survey survey;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Option> option;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTextQuestion() {
        return this.textQuestion;
    }

    public void setTextQuestion(String textQuestion) {
        this.textQuestion = textQuestion;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public List<Option> getOption() {
        return this.option;
    }

    public void setOption(List<Option> option) {
        this.option = option;
    }


    public Question() {
    }

    public Question(Long id, String textQuestion, Survey survey, List<Option> option) {
        this.id = id;
        this.textQuestion = textQuestion;
        this.survey = survey;
        this.option = option;
    }



}
