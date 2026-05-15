package com.equipo.backend.model;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "users")
@Data

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long id;


    private String name;        
    private String apellido1;
    private String apellido2;
    @Column(unique = true)
    private String email;
    private String genero;
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date fechaNacimiento;
    private Integer edad;
    private String localizacion;
    private String urlIdStream;
    private Date creacionCuentaUsuario;
    private Date creacionCuentaSteam;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String urlImgUsuario;
    private Byte banned;
    private Byte id_rol = 0;
    private Integer registrationStep; // 1: Básico, 2: Perfil, 3: Steam, 4: Completado
    @Column(name = "is_active")
    private Boolean isActive = false; //
        
    // RELACIÓN ONE TO ONE
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "steam_perfil_id", referencedColumnName = "id_user_steam", foreignKey = @ForeignKey(name = "FK_USER_STEAM"))
    @ToString.Exclude 
    private UserSteam userSteam;



    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<UserGame> userGamesList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<UserSurveys> userSurveysList = new ArrayList<>();

    @OneToOne
    @JsonIgnore
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

    public String getGenero() {
        return this.genero;
    }
    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Integer getEdad() {
        return this.edad;
    }
    public void setEdad(Integer edad) {
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

    public Date getFechaNacimiento() {
        return this.fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public Integer getRegistrationStep() {
        return this.registrationStep;
    }

    public void setRegistrationStep(Integer registrationStep) {
        this.registrationStep = registrationStep;
    }

    public Boolean isIsActive() {
        return this.isActive;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public List<UserSurveys> getUserSurveysList() {
        return this.userSurveysList;
    }

    public void setUserSurveysList(List<UserSurveys> userSurveysList) {
        this.userSurveysList = userSurveysList;
    }

    public BonoTotal getBonoTotal() {
        return this.bonoTotal;
    }

    public void setBonoTotal(BonoTotal bonoTotal) {
        this.bonoTotal = bonoTotal;
    }

    public Byte getId_rol() {
        return this.id_rol;
    }

    public void setId_rol(Byte id_rol) {
        this.id_rol = id_rol;
    }


    public User() {
    }



    public User(Long id, String name, String apellido1, String apellido2, String email, String genero, Integer edad, String localizacion, String urlIdStream, Date creacionCuentaUsuario, Date creacionCuentaSteam, String password, String urlImgUsuario, Byte banned, Byte id_rol, List<UserGame> userGamesList, List<UserSurveys> userSurveysList, BonoTotal bonoTotal) {
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
        this.id_rol = id_rol;
        this.userGamesList = userGamesList;
        this.userSurveysList = userSurveysList;
        this.bonoTotal = bonoTotal;
    }



    public UserSteam getUserSteam() {
        return this.userSteam;
    }

    public void setUserSteam(UserSteam userSteam) {
        this.userSteam = userSteam;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", getEmail()="
                + getEmail() + ", getId()=" + getId() + ", getName()=" + getName() + ", getPassword()=" + getPassword()
                + "]";
    }
    
}
