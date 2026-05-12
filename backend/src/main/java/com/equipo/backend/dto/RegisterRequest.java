package com.equipo.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    // Discriminador: "USER" o "CLIENT"
    private String type;

    // Campos Comunes
    private String email;
    private String password;
    private String name; // Para Cliente es 'nombre', para User es 'name'

    // Campos específicos de USER (Jugador)
    private String apellido1;
    private String apellido2;
    private Integer edad;
    private String genero;
    private String localizacion;
    private String urlIdStream;
    private String urlImgUsuario;
    private Integer step;

    // Campos específicos de CLIENT (Empresa/Organizador)
    private String cuentaBancaria;
    private String urlImagen;


    // --- GETTERS Y SETTERS COMUNES ---

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // --- GETTERS Y SETTERS DE USUARIO (USER) ---

    public String getApellido1() { return apellido1; }
    public void setApellido1(String apellido1) { this.apellido1 = apellido1; }

    public String getApellido2() { return apellido2; }
    public void setApellido2(String apellido2) { this.apellido2 = apellido2; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getLocalizacion() { return localizacion; }
    public void setLocalizacion(String localizacion) { this.localizacion = localizacion; }

    public String getUrlIdStream() { return urlIdStream; }
    public void setUrlIdStream(String urlIdStream) { this.urlIdStream = urlIdStream; }

    public String getUrlImgUsuario() { return urlImgUsuario; }
    public void setUrlImgUsuario(String urlImgUsuario) { this.urlImgUsuario = urlImgUsuario; }


    public Integer getStep() { return this.step; }
    public void setStep(Integer step) { this.step = step;}


    // --- GETTERS Y SETTERS DE CLIENTE (CLIENT) ---

    public String getCuentaBancaria() { return cuentaBancaria; }
    public void setCuentaBancaria(String cuentaBancaria) { this.cuentaBancaria = cuentaBancaria; }

    public String getUrlImagen() { return urlImagen; }
    public void setUrlImagen(String urlImagen) { this.urlImagen = urlImagen; }



}
