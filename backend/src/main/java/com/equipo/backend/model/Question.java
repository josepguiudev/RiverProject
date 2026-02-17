package com.equipo.backend.model;


import java.util.*;

import jakarta.persistence.*;

@Entity
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_question;
    private String textQuestion;

        //@OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
        //private QuestionConfig config;
        
    @ManyToOne
    @JoinColumn(name = "id_survey")
    private Survey survey;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Option> option;


    public Long getId() {
        return id_question;
    }
    public void setId(Long id) {
        this.id_question = id;
    }

    public String getTextQuestion() {
        return textQuestion;
    }
    public void setTextQuestion(String textQuestion) {
        this.textQuestion = textQuestion;
    }

    public Survey getSurvey() {
        return this.survey;
    }
    public void setSurvey(Survey Survey) {
        this.survey = Survey;
    }

    public Long getId_question() {
        return this.id_question;
    }
    public void setId_question(Long id_question) {
        this.id_question = id_question;
    }

    public List<Option> getOption() {
        return this.option;
    }
    public void setOption(List<Option> option) {
        this.option = option;
    }



}
