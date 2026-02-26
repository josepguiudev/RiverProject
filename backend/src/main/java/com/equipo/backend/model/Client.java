package com.equipo.backend.model;

import java.util.*;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "client")
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String cuentaBancaria;
    private String urlImagen;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    @nullable private List<Survey> surveyList = new ArrayList<>();



    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCuentaBancaria() {
        return this.cuentaBancaria;
    }

    public void setCuentaBancaria(String cuentaBancaria) {
        this.cuentaBancaria = cuentaBancaria;
    }

    public String getUrlImagen() {
        return this.urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public List<Survey> getSurveyList() {
        return this.surveyList;
    }

    public void setSurveyList(List<Survey> surveyList) {
        this.surveyList = surveyList;
    }

    public Client() {
    }


    public Client(Long id, String nombre, String cuentaBancaria, String urlImagen, List<Survey> surveyList) {
        this.id = id;
        this.nombre = nombre;
        this.cuentaBancaria = cuentaBancaria;
        this.urlImagen = urlImagen;
        this.surveyList = surveyList;
    }


}
