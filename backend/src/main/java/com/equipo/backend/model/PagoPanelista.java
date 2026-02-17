package com.equipo.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "pago_panlista")
public class PagoPanelista {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_pago_panelista;
        private String codigo;
        private double cantidadPago;

        public Long getId_pago_panelista() {
                return this.id_pago_panelista;
        }

        public void setId_pago_panelista(Long id_pago_panelista) {
                this.id_pago_panelista = id_pago_panelista;
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



}
