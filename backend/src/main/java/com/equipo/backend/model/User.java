package com.equipo.backend.model;

import java.util.*;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Table(name = "users")
@Data

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    @nullable private String apellido1;
    @nullable private String apellido2;
    @Column(unique = true)
    private String email;
    @nullable private Byte genero;
    @nullable private Byte edad;
    @nullable private String localizacion;
    @nullable private String urlIdStream;
    @nullable private Date creacionCuentaUsuario;
    @nullable private Date creacionCuentaSteam;
    private String password;
    @nullable private String urlImgUsuario;
    @nullable private Byte banned;



    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserGame> userGamesList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserSurveys> userSurveyList = new ArrayList<>();

    @OneToOne
    private BonoTotal bonoTotal; 


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

    public Byte getBanned() {
        return this.banned;
    }

    public void setBanned(Byte banned) {
        this.banned = banned;
    }

    public List<UserGame> getUserGamesList() {
        return this.userGamesList;
    }

    public void setUserGamesList(List<UserGame> userGamesList) {
        this.userGamesList = userGamesList;
    }

    public List<UserSurveys> getUserSurveyList() {
        return this.userSurveyList;
    }

    public void setUserSurveyList(List<UserSurveys> userSurveyList) {
        this.userSurveyList = userSurveyList;
    }

    public BonoTotal getBonoTotal() {
        return this.bonoTotal;
    }

    public void setBonoTotal(BonoTotal bonoTotal) {
        this.bonoTotal = bonoTotal;
    }


    public User() {
    }



    public User(Long id, String name, String apellido1, String apellido2, String email, Byte genero, Byte edad, String localizacion, String urlIdStream, Date creacionCuentaUsuario, Date creacionCuentaSteam, String password, String urlImgUsuario, Byte banned, List<UserGame> userGamesList, List<UserSurveys> userSurveyList, BonoTotal bonoTotal) {
        this.id = id;
        this.name = name;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.email = email;
        this.genero = genero;
        this.edad = edad;
        this.localizacion = localizacion;
        this.urlIdStream = urlIdStream;
        this.creacionCuentaUsuario = creacionCuentaUsuario;
        this.creacionCuentaSteam = creacionCuentaSteam;
        this.password = password;
        this.urlImgUsuario = urlImgUsuario;
        this.banned = banned;
        this.userGamesList = userGamesList;
        this.userSurveyList = userSurveyList;
        this.bonoTotal = bonoTotal;
    }
   




    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", getEmail()="
                + getEmail() + ", getId()=" + getId() + ", getName()=" + getName() + ", getPassword()=" + getPassword()
                + "]";
    }
}
