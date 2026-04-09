package com.equipo.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.equipo.backend.dto.EncuestaParcialDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO;
import com.equipo.backend.dto.EncuestaRespuestaDTO.RespuestaDTO;
import com.equipo.backend.dto.SurveySummaryDTO;
import com.equipo.backend.model.Option;
import com.equipo.backend.model.Question;
import com.equipo.backend.model.Respuesta;
import com.equipo.backend.model.Survey;
import com.equipo.backend.repository.OptionRepository;
import com.equipo.backend.repository.QuestionRepository;
import com.equipo.backend.repository.RespuestaRepository;
import com.equipo.backend.repository.SurveyRepository;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.repository.UserSurveysRepository;

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
    // 1. INYECTA EL REPOSITORIO DE LA TABLA INTERMEDIA
    private final UserSurveysRepository userSurveysRepository; 

        @Override
        public void guardarRespuestas(EncuestaRespuestaDTO encuestaRespuestaDTO, boolean completada) {
            Long userId = (encuestaRespuestaDTO.getIdUser() != null) ? encuestaRespuestaDTO.getIdUser() : 1L;
            var user = userRepository.findById(userId).orElseThrow();

            // 1. Limpiar respuestas anteriores de esta encuesta para este usuario 
            // (Importante para que el "desmarcar" un checkbox funcione al sobreescribir)
            respuestaRepository.deleteByUserIdAndOption_Question_Survey_Id(userId, encuestaRespuestaDTO.getIdEncuesta());

            // 2. Guardar las nuevas
            for (EncuestaRespuestaDTO.RespuestaDTO rDto : encuestaRespuestaDTO.getRespuestas()) {
                Respuesta nueva = new Respuesta();
                nueva.setUser(user);
                nueva.setValueRespuesta(rDto.getValor());
                nueva.setIsCompletada(completada ? (byte) 1 : (byte) 0);
                
                if (rDto.getIdOpcion() != null) {
                    optionRepository.findById(rDto.getIdOpcion()).ifPresent(nueva::setOption);
                }
                
                respuestaRepository.save(nueva);
            }

        // 3. Actualizar tabla intermedia
        if (completada) {
            userSurveysRepository.findByUserIdAndSurveyId(userId, encuestaRespuestaDTO.getIdEncuesta())
                .ifPresent(relacion -> {
                    relacion.setIsRespondida((byte) 1);
                    userSurveysRepository.save(relacion);
                });
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
        Survey survey = encuestaRepository.findById(idEncuesta)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));

        // Traemos todas las respuestas del usuario para esta encuesta
        List<Respuesta> respuestasGuardadas = respuestaRepository.findByOption_Question_Survey_IdAndUserId(idEncuesta, idUser);

        EncuestaParcialDTO parcialDTO = new EncuestaParcialDTO();
        parcialDTO.setIdEncuesta(idEncuesta);
        parcialDTO.setNombreEncuesta(survey.getName());
        
        // Verificamos estado de la encuesta en la tabla intermedia o por flag
        parcialDTO.setCompletada(respuestasGuardadas.stream().anyMatch(r -> r.getIsCompletada() == (byte) 1));

        List<EncuestaParcialDTO.PreguntaCargadaDTO> listaPreguntas = survey.getQuestionList().stream().map(pregunta -> {
            EncuestaParcialDTO.PreguntaCargadaDTO pDTO = new EncuestaParcialDTO.PreguntaCargadaDTO();
            pDTO.setIdPregunta(pregunta.getId());
            pDTO.setTextoPregunta(pregunta.getTextQuestion());

            // --- CORRECCIÓN: Lógica de esMultiple ---
            // Asumimos que si tienes QuestionConfig, lo sacamos de ahí. 
            // Si no, puedes usar: "MULTIPLE_CHOICE".equals(pregunta.getConfig().getTypeName())
            if (pregunta.getConfig() != null) {
                // Si isMultiple() es null, asigna false. Si no, usa su valor.
                Boolean multiple = pregunta.getConfig().getIsMultiple();
                pDTO.setEsMultiple(multiple != null ? multiple : false); 
            }
                        // Mapear opciones disponibles
            pDTO.setOpcionesDisponibles(pregunta.getOption().stream().map(opt -> {
                EncuestaParcialDTO.OpcionDisponibleDTO oDTO = new EncuestaParcialDTO.OpcionDisponibleDTO();
                oDTO.setIdOpcion(opt.getId());
                oDTO.setTextoOpcion(opt.getTextOpcion());
                return oDTO;
            }).toList());

            // --- CORRECCIÓN: Cargar Múltiples Respuestas ---
            List<Respuesta> respuestasDeEstaPregunta = respuestasGuardadas.stream()
                .filter(r -> r.getOption() != null && r.getOption().getQuestion().getId().equals(pregunta.getId()))
                .toList();

            if (!respuestasDeEstaPregunta.isEmpty()) {
                // Llenamos la lista de IDs para el modo múltiple (Checkbox)
                List<Long> seleccionados = respuestasDeEstaPregunta.stream()
                    .map(r -> r.getOption().getId())
                    .toList();
                pDTO.setIdsOpcionesSeleccionadas(seleccionados);

                // Para compatibilidad con Radio, ponemos el primero en idOpcionSeleccionada
                pDTO.setIdOpcionSeleccionada(seleccionados.get(0));
                
                // Valor de texto (si aplica)
                pDTO.setValorRespuesta(respuestasDeEstaPregunta.get(0).getValueRespuesta());
            }

            return pDTO;
        }).toList();

        parcialDTO.setPreguntas(listaPreguntas);
        return parcialDTO;
    }

    @Override
    public List<SurveySummaryDTO> obtenerResumenEncuestasPorUsuario(Long idUser) {
        return userSurveysRepository.findByUserIdWithSurvey(idUser).stream()
            .map(relacion -> new SurveySummaryDTO(
                relacion.getId(), // id de la relacion
                relacion.getIsRespondida() == (byte) 1 ? 1 : 0, // isRespondida como numero
                new SurveySummaryDTO.SurveySimpleDTO(
                    relacion.getSurvey().getId(),
                    relacion.getSurvey().getName()
                )
            ))
            .collect(Collectors.toList());
    }

   @Override
   public Respuesta actualizarRespuesta(Long idRespuesta, RespuestaDTO respuestaDTO) {
	// TODO Auto-generated method stub
	throw new UnsupportedOperationException("Unimplemented method 'actualizarRespuesta'");
   }
   
}