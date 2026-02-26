package com.equipo.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "opcion_respuesta")
@Data
public class OpcionRespuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_opcion")
    private Option opcion;

    @OneToOne
    @JoinColumn(name = "id_respuesta")
    private Respuesta respuesta;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Option getOpcion() {
        return this.opcion;
    }

    public void setOpcion(Option opcion) {
        this.opcion = opcion;
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
        this.opcion = opcion;
        this.respuesta = respuesta;
    }



}
