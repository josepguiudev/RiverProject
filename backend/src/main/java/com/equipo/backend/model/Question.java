package com.equipo.backend.model;


import java.util.*;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "question")
@Data
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_question")
    private Long id;
    private String textQuestion;
        
    @ManyToOne
    @JoinColumn(name = "id_survey")
    @JsonBackReference
    private Survey survey;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @BatchSize(size = 50)
    @JsonManagedReference
    @ToString.Exclude
    private List<Option> option = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<PreguntaOpcion> preguntaOption = new ArrayList<>();


    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonManagedReference
    private QuestionConfig config;

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


    public List<PreguntaOpcion> getPreguntaOption() {
        return this.preguntaOption;
    }

    public void setPreguntaOption(List<PreguntaOpcion> preguntaOption) {
        this.preguntaOption = preguntaOption;
    }

    public QuestionConfig getConfig() {
        return this.config;
    }

    public void setConfig(QuestionConfig config) {
        this.config = config;
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
