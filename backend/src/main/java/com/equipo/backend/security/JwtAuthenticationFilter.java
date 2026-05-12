package com.equipo.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro de autenticación que se ejecuta en cada petición HTTP.
 * Verifica la presencia de un token JWT en el header Authorization,
 * lo valida y establece la identidad del usuario en el contexto de seguridad de Spring.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // 1. Obtenemos el header de Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Si no hay token o no empieza por "Bearer ", seguimos con el siguiente filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraemos el token JWT y el email del usuario
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);

        // 4. Si el usuario no está ya autenticado en el contexto actual...
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 5. Validamos el token
            if (jwtService.isTokenValid(jwt)) {
                // 6. Creamos el objeto de autenticación y lo guardamos en el contexto
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        Collections.emptyList() // Aquí podrías añadir Authorities si usaras roles de Spring Security
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continuamos con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
