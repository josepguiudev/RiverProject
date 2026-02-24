package com.equipo.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

@Entity
@Table(name = "form_responses")
public class FormResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String email;
    
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;
    
    // Constructor vacío (requerido por JPA)
    public FormResponse() {
        this.fechaEnvio = LocalDateTime.now();
    }
    
    // Constructor con parámetros
    public FormResponse(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
        this.fechaEnvio = LocalDateTime.now();
    }

    ////////////////
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
}