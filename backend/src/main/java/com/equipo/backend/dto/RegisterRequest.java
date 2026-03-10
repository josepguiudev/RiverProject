package com.equipo.backend.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Byte edad;
    private Byte genero;
    private String localizacion;

    // Getters existentes...
    public String getEmail() { return this.email; }
    public String getPassword() { return this.password; }
    public String getName() { return this.name; }
    public Byte getEdad() { return this.edad; }
    public Byte getGenero() { return this.genero; }
    public String getLocalizacion() { return this.localizacion; }

    // SETTERS (Añade los que faltan aquí abajo)
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    
    public void setEdad(Byte edad) { this.edad = edad; }
    public void setGenero(Byte genero) { this.genero = genero; }
    public void setLocalizacion(String localizacion) { this.localizacion = localizacion; }
}