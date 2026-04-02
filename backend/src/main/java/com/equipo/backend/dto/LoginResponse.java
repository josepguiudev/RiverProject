package com.equipo.backend.dto;

import com.equipo.backend.model.User;

public class LoginResponse {
    private String token;
    private User user; // Añadimos el campo User

    // Constructor vacío (necesario para Jackson/JSON)
    public LoginResponse() {}

    // Constructor con Token (por si lo usas en otro lado)
    public LoginResponse(String token) {
        this.token = token;
    }

    // NUEVO: Constructor con ambos parámetros
    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    // Getters y Setters (Importantes para que Spring genere el JSON)
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}