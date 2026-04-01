package com.equipo.backend.model;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;


@Entity
@Table(name = "client")
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long id;

    @Column(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String nombre;
    private String cuentaBancaria;
    private String urlImagen;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonBackReference
    @ToString.Exclude
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


    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Client() {
    }


    public Client(Long id, String email, String password, String nombre, String cuentaBancaria, String urlImagen, List<Survey> surveyList) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.cuentaBancaria = cuentaBancaria;
        this.urlImagen = urlImagen;
        this.surveyList = surveyList;
    }



}
