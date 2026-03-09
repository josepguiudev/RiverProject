package com.equipo.backend.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class EncuestaRespuestaDTO {

    private Long idEncuesta;
    private Long idUser;
    private List<RespuestaDTO> respuestas  = new ArrayList<>();

    @Data
    public static class RespuestaDTO {
        private Long idPregunta;
        private Long idOpcion;      
        private String valor;
        private boolean isRespondida;
       

    }
}