package com.equipo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Object user;
    private String role;           // "USER" o "CLIENT"
    private Integer registrationStep; // 1, 2, 3 o null para clientes
}


