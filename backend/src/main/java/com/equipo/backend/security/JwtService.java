package com.equipo.backend.security;

import org.springframework.stereotype.Service;
import com.equipo.backend.model.User;
import com.equipo.backend.model.Client;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

@Service
public class JwtService {
    //TODO -> este tipo de variables han de ir a un archivo interno, un ejemplo seria en el .env
    private final String SECRET = "Pepe_Moha_Hugo_Joako_Clave_HEXADECIMAL!2026";

    //Creacion del TOKEN del usuario
    // Método para Usuarios (Jugadores)
    public String generateToken(User user) {
        String token = Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getId()) // O user.getId_rol() según prefieras
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();

        System.out.println(token + " ---------------- USER TOKEN ----------------");
        return token;
    }

    // Método para Clientes (Empresas) - ESTE ES EL QUE TE FALTA
    public String generateTokenForClient(Client client) {
        String token = Jwts.builder()
                .setSubject(client.getEmail())
                .claim("role", client.getId()) // ID del cliente
                .claim("type", "CLIENT")      // Extra para identificar que es empresa
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();

        System.out.println(token + " ---------------- CLIENT TOKEN ---------------");
        return token;
    }

}
