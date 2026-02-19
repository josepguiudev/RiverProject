package com.equipo.backend.model;


import jakarta.persistence.*;


@Entity
@Table(name = "pago")
public class Pago {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_pago;
        private String empresaNombre;
        private double totalCuota;
        private double pagoEnquesta;
        private byte isEnquestaPagada;
        
        @OneToOne
        @JoinColumn(name = "id_survey")
        private Survey survey;



        public Long getId_pago() {
                return this.id_pago;
        }

        public void setId_pago(Long id_pago) {
                this.id_pago = id_pago;
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



}
