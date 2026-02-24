package com.equipo.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "question_options")
@Data
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String textOpcion; 

    @ManyToOne
    @JoinColumn(name = "id")
    @JsonBackReference
    private Question question;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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


    public Option() {
    }

    public Option(Long id, String textOpcion, Question question) {
        this.id = id;
        this.textOpcion = textOpcion;
        this.question = question;
    }
    

}
