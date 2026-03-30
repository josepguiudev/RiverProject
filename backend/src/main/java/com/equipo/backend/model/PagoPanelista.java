package com.equipo.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "pago_panlista")
@Data
public class PagoPanelista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago_panelista")
    private Long id;
    private String codigo;
    private Double cantidadPago;

    @OneToOne(mappedBy = "pagoPanelista")
    @JsonIgnore
    @ToString.Exclude
    private Survey survey;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public double getCantidadPago() {
        return this.cantidadPago;
    }

    public void setCantidadPago(double cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public PagoPanelista() {
    }

    public PagoPanelista(Long id, String codigo, double cantidadPago, Survey survey) {
        this.id = id;
        this.codigo = codigo;
        this.cantidadPago = cantidadPago;
        this.survey = survey;
    }


}
