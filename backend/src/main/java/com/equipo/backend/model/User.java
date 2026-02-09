package com.equipo.backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.Data;

@Entity
@Table(name = "users")
@Data

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String apellido1;
    @nullable private String apellido2;
    private String email;
    private Byte genero;
    private Byte edad;
    private String localizacion;
    private String urlIdStream;
    private Date creacionCuentaUsuario;
    private Date creacionCuentaSteam;
    private String password;
    @nullable private String urlImgUsuario;

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getApellido1() {
        return this.apellido1;
    }
    public void setApellido1(String apellido1) {
        this.apellido1 = apellido1;
    }

    public String getApellido2() {
        return this.apellido2;
    }
    public void setApellido2(String apellido2) {
        this.apellido2 = apellido2;
    }

    public Byte getGenero() {
        return this.genero;
    }
    public void setGenero(Byte genero) {
        this.genero = genero;
    }

    public Byte getEdad() {
        return this.edad;
    }
    public void setEdad(Byte edad) {
        this.edad = edad;
    }

    public String getLocalizacion() {
        return this.localizacion;
    }
    public void setLocalizacion(String localizacion) {
        this.localizacion = localizacion;
    }

    public String getUrlIdStream() {
        return this.urlIdStream;
    }
    public void setUrlIdStream(String urlIdStream) {
        this.urlIdStream = urlIdStream;
    }

    public Date getCreacionCuentaUsuario() {
        return this.creacionCuentaUsuario;
    }
    public void setCreacionCuentaUsuario(Date creacionCuentaUsuario) {
        this.creacionCuentaUsuario = creacionCuentaUsuario;
    }

    public Date getCreacionCuentaSteam() {
        return this.creacionCuentaSteam;
    }
    public void setCreacionCuentaSteam(Date creacionCuentaSteam) {
        this.creacionCuentaSteam = creacionCuentaSteam;
    }

    public String getUrlImgUsuario() {
        return this.urlImgUsuario;
    }
    public void setUrlImgUsuario(String urlImgUsuario) {
        this.urlImgUsuario = urlImgUsuario;
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

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", getEmail()="
                + getEmail() + ", getId()=" + getId() + ", getName()=" + getName() + ", getPassword()=" + getPassword()
                + "]";
    }
}
