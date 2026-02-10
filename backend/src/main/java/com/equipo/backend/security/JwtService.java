package com.equipo.backend.security;

import com.equipo.backend.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

public class JwtService {
    //TODO -> este tipo de variables han de ir a un archivo interno, un ejemplo seria en el .env
    private final String SECRET = "Pepe_Moha_Hugo_Joako_Clave_HEXADECIMAL!2026";

    //Creacion del TOKEN del usuario
    public String generateToken(User user){
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(
                    new Date(System.currentTimeMillis() + 1000 * 60 * 60)
                )
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

}
