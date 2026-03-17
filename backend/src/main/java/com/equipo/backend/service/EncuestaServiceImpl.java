package com.equipo.backend.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO.RespuestaDTO;
import com.equipo.backend.model.Option;
import com.equipo.backend.model.Question;
import com.equipo.backend.model.Respuesta;
import com.equipo.backend.model.Survey;
import com.equipo.backend.repository.OptionRepository;
import com.equipo.backend.repository.QuestionRepository;
import com.equipo.backend.repository.RespuestaRepository;
import com.equipo.backend.repository.SurveyRepository;
import com.equipo.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EncuestaServiceImpl implements EncuestaService {

    private final SurveyRepository encuestaRepository;
    private final QuestionRepository preguntaRepository;
    private final OptionRepository optionRepository;
    private final RespuestaRepository respuestaRepository;
    private final UserRepository userRepository;

    @Override
    public void guardarRespuestas(EncuestaRespuestaDTO encuestaRespuestaDTO, boolean completada) {

        // 1. Definimos el ID (venga de la App o forzado a 1)
        Long userId = (encuestaRespuestaDTO.getIdUser() != null) ? encuestaRespuestaDTO.getIdUser() : 1L; 

        Survey encuesta = encuestaRepository.findById(encuestaRespuestaDTO.getIdEncuesta())
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));

        for (EncuestaRespuestaDTO.RespuestaDTO r : encuestaRespuestaDTO.getRespuestas()) {
            
            // CAMBIO AQUÍ: Usamos 'userId', NO 'r.getIdUser()'
            Respuesta respuesta = respuestaRepository.findByUserIdAndOption_Question_Id(userId, r.getIdPregunta())
                .orElse(new Respuesta());

            // CAMBIO AQUÍ: Usamos 'userId', NO 'r.getIdUser()'
            respuesta.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User no encontrado")));
            
            respuesta.setOption(r.getIdOpcion() != null 
                ? optionRepository.findById(r.getIdOpcion()).orElse(null) : null);
            
            respuesta.setValueRespuesta(r.getValor());
            respuesta.setIsCompletada(completada ? (byte) 1 : (byte) 0);

            respuestaRepository.save(respuesta);
        }
    }

    @Override
    public void guardarRespuestaIndividual(Long idUser, Long idEncuesta, RespuestaDTO respuestaIndividual) {
        var user = userRepository.findById(idUser)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Option opcion = optionRepository.findById(respuestaIndividual.getIdOpcion())
                .orElseThrow(() -> new RuntimeException("Opción no encontrada"));

        // CAMBIO: Usamos el nuevo método de navegación profunda
        Respuesta respuesta = respuestaRepository.findByUserIdAndOption_Question_Id(idUser, respuestaIndividual.getIdPregunta())
                .orElse(new Respuesta());

        if (respuesta.getId() == null) {
            respuesta.setUser(user);
        }
        respuesta.setOption(opcion);
        respuesta.setValueRespuesta(respuestaIndividual.getValor());
        respuesta.setIsCompletada((byte) 0); 

        respuestaRepository.save(respuesta);
    }

   @Override
    @Transactional
    public EncuestaParcialDTO cargarRespuestas(Long idEncuesta, Long idUser) {
        // 1. Buscamos la encuesta completa (Estructura fija)
        Survey survey = encuestaRepository.findById(idEncuesta)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));

        // 2. Buscamos las respuestas que el usuario ya tenga guardadas
        List<Respuesta> respuestasGuardadas = respuestaRepository.findByOption_Question_Survey_IdAndUserId(idEncuesta, idUser);

        // 3. Montamos el DTO
        EncuestaParcialDTO parcialDTO = new EncuestaParcialDTO();
        parcialDTO.setIdEncuesta(idEncuesta);
        parcialDTO.setNombreEncuesta(survey.getName());
        
        // Verificamos si alguna respuesta marca la encuesta como completada
        parcialDTO.setCompletada(respuestasGuardadas.stream().anyMatch(r -> r.getIsCompletada() == (byte) 1));

        // 4. Mapeamos TODAS las preguntas de la encuesta
        List<EncuestaParcialDTO.PreguntaCargadaDTO> listaPreguntas = survey.getQuestionList().stream().map(pregunta -> {
            EncuestaParcialDTO.PreguntaCargadaDTO pDTO = new EncuestaParcialDTO.PreguntaCargadaDTO();
            pDTO.setIdPregunta(pregunta.getId());
            pDTO.setTextoPregunta(pregunta.getTextQuestion());

            // Rellenamos las opciones que el usuario puede elegir
            pDTO.setOpcionesDisponibles(pregunta.getOption().stream().map(opt -> {
                EncuestaParcialDTO.OpcionDisponibleDTO oDTO = new EncuestaParcialDTO.OpcionDisponibleDTO();
                oDTO.setIdOpcion(opt.getId());
                oDTO.setTextoOpcion(opt.getTextOpcion());
                return oDTO;
            }).toList());

            // Buscamos si existe una respuesta guardada para ESTA pregunta
            respuestasGuardadas.stream()
                .filter(r -> r.getOption() != null && r.getOption().getQuestion().getId().equals(pregunta.getId()))
                .findFirst()
                .ifPresent(r -> {
                    pDTO.setIdOpcionSeleccionada(r.getOption().getId());
                    pDTO.setValorRespuesta(r.getValueRespuesta());
                });

            return pDTO;
        }).toList();

        parcialDTO.setPreguntas(listaPreguntas);
        return parcialDTO;
    }

   @Override
   public Respuesta actualizarRespuesta(Long idRespuesta, RespuestaDTO respuestaDTO) {
	// TODO Auto-generated method stub
	throw new UnsupportedOperationException("Unimplemented method 'actualizarRespuesta'");
   }
   
}