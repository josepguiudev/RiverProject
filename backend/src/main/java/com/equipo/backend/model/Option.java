package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "options")
@Data
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_option")
    private Long id;

    @Column(name = "text_opcion")
    private String textOpcion; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_question")
    @JsonBackReference
    private Question question;
/* 
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<PreguntaOpcion> preguntaOpciones = new ArrayList<>();
*/
    @OneToOne(mappedBy = "option", cascade = CascadeType.ALL)
    @JsonIgnore
    private OpcionRespuesta opcionRespuesta;


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
/* 
    public List<PreguntaOpcion> getPreguntaOpciones() {
        return this.preguntaOpciones;
    }

    public void setPreguntaOpciones(List<PreguntaOpcion> preguntaOpciones) {
        this.preguntaOpciones = preguntaOpciones;
    }
 */
    public OpcionRespuesta getOpcionRespuesta() {
        return this.opcionRespuesta;
    }

    public void setOpcionRespuesta(OpcionRespuesta opcionRespuesta) {
        this.opcionRespuesta = opcionRespuesta;
    }


    public Option() {
    }

    public Option(Long id, String textOpcion, Question question, OpcionRespuesta opcionRespuesta) {
        this.id = id;
        this.textOpcion = textOpcion;
        this.question = question;
        //this.preguntaOpciones = preguntaOpciones;
        this.opcionRespuesta = opcionRespuesta;
    }

    public Option(Long id, String textOpcion, Question question, List<PreguntaOpcion> preguntaOpciones, OpcionRespuesta opcionRespuesta) {
        this.id = id;
        this.textOpcion = textOpcion;
        this.question = question;
        //this.preguntaOpciones = preguntaOpciones;
        this.opcionRespuesta = opcionRespuesta;
    }
  


}
