package com.equipo.backend.service;

import java.util.List;
import java.util.Map;

import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO.RespuestaDTO;
import com.equipo.backend.dto.SurveySummaryDTO;
import com.equipo.backend.model.Respuesta;

public interface EncuestaService {


    void guardarRespuestas(EncuestaRespuestaDTO encuestaRespuestaDTO, boolean completada);

    Respuesta actualizarRespuesta(Long idRespuesta, RespuestaDTO respuestaDTO);

    void guardarRespuestaIndividual(Long idUser, Long idEncuesta, RespuestaDTO respuestaIndividual);

    EncuestaParcialDTO cargarRespuestas(Long idEncuesta, Long idUser);
    
    List<SurveySummaryDTO> obtenerResumenEncuestasPorUsuario(Long idUser);

    List<Map<String, Object>> obtenerEstadisticasVotos(Long idSurvey);

}