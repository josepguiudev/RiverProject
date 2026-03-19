package com.equipo.backend.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class EncuestaParcialDTO {
    private Long idEncuesta;
    private String nombreEncuesta; // Nuevo: Para el título "Terraria..."
    private boolean isCompletada; 
    private List<PreguntaCargadaDTO> preguntas = new ArrayList<>(); // Cambiamos el nombre para que sea más claro

    @Data
    public static class PreguntaCargadaDTO {
        private Long idPregunta;
        private String textoPregunta; // Nuevo: Para mostrar la pregunta
        private Long idOpcionSeleccionada; // Antes era idOpcion
        private String valorRespuesta; // Antes era valor
        
        // Nuevo: Lista de opciones posibles para esta pregunta
        private List<OpcionDisponibleDTO> opcionesDisponibles = new ArrayList<>();
    }

    @Data
    public static class OpcionDisponibleDTO {
        private Long idOpcion;
        private String textoOpcion; // Nuevo: Lo que el usuario lee para marcar
    }

    @Data
    public static class RespuestaCargadaDTO {

        private Long idPregunta;
        private Long idOpcion;  
        private String valor;   
    }
}
