package com.equipo.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "question_options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_option;

    private String textOpcion; 

    @ManyToOne
    @JoinColumn(name = "id_question")
    @JsonBackReference
    private Question question;


    public Long getId_option() {
        return this.id_option;
    }
    public void setId_option(Long id_option) {
        this.id_option = id_option;
    }

    public String getTextOpcion() {
        return this.textOpcion;
    }
    public void setTextOpcion(String textOpcion) {
        this.textOpcion = textOpcion;
    }

    public Question getQuestion() {
        return this.question;
    }
    public void setQuestion(Question question) {
        this.question = question;
    }


}
