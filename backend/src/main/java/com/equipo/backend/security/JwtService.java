package com.equipo.backend.security;

import org.springframework.stereotype.Service;
import com.equipo.backend.model.User;
import com.equipo.backend.model.Client;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

/**
 * Servicio para la gestión de tokens JWT (JSON Web Tokens).
 * Se encarga de la generación y validación de tokens tanto para usuarios como para clientes.
 */
@Service
public class JwtService {
    // Clave secreta para firmar los tokens.
    // TODO -> este tipo de variables han de ir a un archivo interno, un ejemplo sería en el .env
    private final String SECRET = "Pepe_Moha_Hugo_Joako_Clave_HEXADECIMAL!2026";

    /**
     * Genera un token JWT para un Usuario (Jugador).
     * @param user La entidad del usuario.
     * @return El token JWT generado.
     */
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

    /**
     * Genera un token JWT para un Cliente (Empresa).
     * @param client La entidad del cliente.
     * @return El token JWT generado.
     */
    public String generateTokenForClient(Client client) {
        String token = Jwts.builder()
                .setSubject(client.getEmail())
                .claim("role", client.getId()) 
                .claim("type", "CLIENT")      
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 horas
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();

        System.out.println(token + " ---------------- CLIENT TOKEN ---------------");
        return token;
    }

    /**
     * Extrae el email (subject) de un token JWT.
     * @param token El token JWT.
     * @return El email del usuario.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Valida si un token es correcto y no ha expirado.
     * @param token El token JWT.
     * @return true si es válido, false en caso contrario.
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
