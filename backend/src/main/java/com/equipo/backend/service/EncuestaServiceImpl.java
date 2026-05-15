package com.equipo.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional(readOnly = true)
    public EncuestaParcialDTO cargarRespuestas(Long idEncuesta, Long idUser) {
        // 1. Obtener la encuesta
        Survey survey = encuestaRepository.findByIdWithQuestions(idEncuesta);
        
        // Validar manualmente si es nulo
        if (survey == null) {
            throw new RuntimeException("No se encontró la encuesta con ID: " + idEncuesta);
        }

        // 2. FORZAR LA CARGA DE OPCIONES
        if (survey.getQuestionList() != null) {
            for (Question q : survey.getQuestionList()) {
                // El .size() o acceder a cualquier propiedad dispara la carga perezosa (Lazy Loading)
                if (q.getOption() != null) {
                    q.getOption().size(); 
                }
                if (q.getConfig() != null) {
                    q.getConfig().getTypeName(); // Esto dispara la SELECT a question_config
                }
            }
        }

    // 3. Obtener las respuestas previas del usuario (Consulta 2 en tu log)
    List<Respuesta> respuestasGuardadas = respuestaRepository.findByOption_Question_Survey_IdAndUserId(idEncuesta, idUser);

    // 4. Mapear al DTO Principal
    EncuestaParcialDTO parcialDTO = new EncuestaParcialDTO();
    parcialDTO.setIdEncuesta(idEncuesta);
    parcialDTO.setNombreEncuesta(survey.getName());
    
    // Marcar si la encuesta ya fue enviada/completada
    boolean completada = respuestasGuardadas.stream()
            .anyMatch(r -> r.getIsCompletada() != null && r.getIsCompletada() == (byte) 1);
    parcialDTO.setCompletada(completada);

    // 5. Mapear la lista de PREGUNTAS (Nombre exacto en tu DTO)
    List<EncuestaParcialDTO.PreguntaCargadaDTO> listaPreguntas = survey.getQuestionList().stream().map(pregunta -> {
        EncuestaParcialDTO.PreguntaCargadaDTO pDTO = new EncuestaParcialDTO.PreguntaCargadaDTO();
        pDTO.setIdPregunta(pregunta.getId());
        pDTO.setTextoPregunta(pregunta.getTextQuestion());
        
        // --- MEJORA DEL MAPEO DE CONFIGURACIÓN ---
        if (pregunta.getConfig() != null) {
            // Accedemos a las propiedades para asegurar que el Proxy se inicialice
            pDTO.setEsMultiple(pregunta.getConfig().getIsMultiple());
            pDTO.setTipoPregunta(pregunta.getConfig().getTypeName()); 
        } else {
            pDTO.setEsMultiple(false);
            pDTO.setTipoPregunta("SHORT_TEXT");
        }

        // 6. Mapear OPCIONES DISPONIBLES (Aquí se llenan los datos de la tabla 'options')
        pDTO.setOpcionesDisponibles(pregunta.getOption().stream().map(opt -> {
            EncuestaParcialDTO.OpcionDisponibleDTO oDTO = new EncuestaParcialDTO.OpcionDisponibleDTO();
            oDTO.setIdOpcion(opt.getId());
            oDTO.setTextoOpcion(opt.getTextOpcion()); 
            return oDTO;
        }).toList());

        // 7. Cargar las respuestas que el usuario seleccionó para esta pregunta
        List<Respuesta> respuestasDeEstaPregunta = respuestasGuardadas.stream()
            .filter(r -> r.getOption() != null && r.getOption().getQuestion().getId().equals(pregunta.getId()))
            .toList();

        if (!respuestasDeEstaPregunta.isEmpty()) {
            // IDs para checkbox/multiple
            List<Long> seleccionados = respuestasDeEstaPregunta.stream()
                .map(r -> r.getOption().getId())
                .toList();
            
            pDTO.setIdsOpcionesSeleccionadas(seleccionados);
            // ID para radio/single choice
            pDTO.setIdOpcionSeleccionada(seleccionados.get(0));
            // Valor de texto (si aplica)
            pDTO.setValorRespuesta(respuestasDeEstaPregunta.get(0).getValueRespuesta());
        } else {
            pDTO.setIdsOpcionesSeleccionadas(new ArrayList<>());
            pDTO.setIdOpcionSeleccionada(null);
            pDTO.setValorRespuesta("");
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
                    relacion.getSurvey().getName(),
                    relacion.getSurvey().getNumQuestions(),
                    relacion.getSurvey().getUrlGraficoSuperset()
                )
            ))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerEstadisticasVotos(Long idSurvey) {
        return respuestaRepository.countVotosBySurveyId(idSurvey);
    }

   @Override
   public Respuesta actualizarRespuesta(Long idRespuesta, RespuestaDTO respuestaDTO) {
	// TODO Auto-generated method stub
	throw new UnsupportedOperationException("Unimplemented method 'actualizarRespuesta'");
   }
   
}