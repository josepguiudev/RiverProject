package com.equipo.backend.model;



import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pregunta_opcion")
@Data

public class PreguntaOpcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_question")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "id_opcion")
    private Option opcion;



    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Option getOpcion() {
        return this.opcion;
    }

    public void setOpcion(Option opcion) {
        this.opcion = opcion;
    }


    public PreguntaOpcion() {
    }


    public PreguntaOpcion(Long id, Question question, Option opcion) {
        this.id = id;
        this.question = question;
        this.opcion = opcion;
    }



}
