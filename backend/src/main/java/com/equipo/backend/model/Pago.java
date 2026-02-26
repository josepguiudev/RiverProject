package com.equipo.backend.model;


import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "pago")
@Data
public class Pago {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String empresaNombre;
        private double totalCuota;
        private double pagoEnquesta;
        private byte isEnquestaPagada;
        
        @OneToOne
        @JoinColumn(name = "id_survey")
        private Survey survey;



    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmpresaNombre() {
        return this.empresaNombre;
    }

    public void setEmpresaNombre(String empresaNombre) {
        this.empresaNombre = empresaNombre;
    }

    public double getTotalCuota() {
        return this.totalCuota;
    }

    public void setTotalCuota(double totalCuota) {
        this.totalCuota = totalCuota;
    }

    public double getPagoEnquesta() {
        return this.pagoEnquesta;
    }

    public void setPagoEnquesta(double pagoEnquesta) {
        this.pagoEnquesta = pagoEnquesta;
    }

    public byte getIsEnquestaPagada() {
        return this.isEnquestaPagada;
    }

    public void setIsEnquestaPagada(byte isEnquestaPagada) {
        this.isEnquestaPagada = isEnquestaPagada;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }


    public Pago() {
    }

    public Pago(Long id, String empresaNombre, double totalCuota, double pagoEnquesta, byte isEnquestaPagada, Survey survey) {
        this.id = id;
        this.empresaNombre = empresaNombre;
        this.totalCuota = totalCuota;
        this.pagoEnquesta = pagoEnquesta;
        this.isEnquestaPagada = isEnquestaPagada;
        this.survey = survey;
    }



}
