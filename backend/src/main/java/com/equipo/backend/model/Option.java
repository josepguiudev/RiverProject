package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "options")
@Data
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String textOpcion; 

    @ManyToOne
    @JoinColumn(name = "id_question")
    @JsonBackReference
    private Question question;

    @OneToMany(mappedBy = "options", cascade = CascadeType.ALL)
    private List<PreguntaOpcion> preguntaOption = new ArrayList<>();

    @OneToOne(mappedBy = "options", cascade = CascadeType.ALL)
    private List<OpcionRespuesta> opcionRespuesta = new ArrayList<>();


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
