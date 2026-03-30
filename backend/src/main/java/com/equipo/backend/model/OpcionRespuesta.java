package com.equipo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "opcion_respuesta")
@Data
public class OpcionRespuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opcion_respuesta")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_option", unique = false)
    @JsonIgnoreProperties("opcionRespuestaList")
    private Option option;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_respuesta", unique = false)
    @JsonIgnore
    private Respuesta respuesta;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Option getOpcion() {
        return this.option;
    }

    public void setOpcion(Option opcion) {
        this.option = opcion;
    }

    public Respuesta getRespuesta() {
        return this.respuesta;
    }

    public void setRespuesta(Respuesta respuesta) {
        this.respuesta = respuesta;
    }


    public OpcionRespuesta() {
    }

    public OpcionRespuesta(Long id, Option opcion, Respuesta respuesta) {
        this.id = id;
        this.option = opcion;
        this.respuesta = respuesta;
    }



}
