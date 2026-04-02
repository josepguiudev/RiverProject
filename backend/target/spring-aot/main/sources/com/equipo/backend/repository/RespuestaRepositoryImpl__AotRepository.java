package com.equipo.backend.repository;

import com.equipo.backend.model.Respuesta;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.Long;
import java.lang.String;
import java.util.List;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link RespuestaRepository}.
 */
@Generated
public class RespuestaRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public RespuestaRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link RespuestaRepository#findByOption_Question_Survey_IdAndUserId(java.lang.Long,java.lang.Long)}.
   */
  public List<Respuesta> findByOption_Question_Survey_IdAndUserId(Long idSurvey, Long idUser) {
    String queryString = "SELECT r FROM Respuesta r LEFT JOIN r.option o LEFT JOIN o.question q LEFT JOIN q.survey s WHERE s.id = :idSurvey AND r.user.id = :idUser";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("idSurvey", idSurvey);
    query.setParameter("idUser", idUser);

    return (List<Respuesta>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link RespuestaRepository#findBySurveyAndUser(java.lang.Long,java.lang.Long)}.
   */
  public List<Respuesta> findBySurveyAndUser(Long idEncuesta, Long idUser) {
    String queryString = "SELECT r FROM Respuesta r WHERE r.option.question.survey.id = :idEncuesta AND r.user.id = :idUser";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("idEncuesta", idEncuesta);
    query.setParameter("idUser", idUser);

    return (List<Respuesta>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link RespuestaRepository#findByUserIdAndOption_Question_Id(java.lang.Long,java.lang.Long)}.
   */
  public Optional<Respuesta> findByUserIdAndOption_Question_Id(Long userId, Long questionId) {
    String queryString = "SELECT r FROM Respuesta r LEFT JOIN r.option o LEFT JOIN o.question q WHERE r.user.id = :userId AND q.id = :questionId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("userId", userId);
    query.setParameter("questionId", questionId);

    return Optional.ofNullable((Respuesta) convertOne(query.getSingleResultOrNull(), false, Respuesta.class));
  }
}
