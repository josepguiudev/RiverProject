package com.equipo.backend.repository;

import com.equipo.backend.model.UserSurveys;
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
 * AOT generated JPA repository implementation for {@link UserSurveysRepository}.
 */
@Generated
public class UserSurveysRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public UserSurveysRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link UserSurveysRepository#findByUserId(java.lang.Long)}.
   */
  public List<UserSurveys> findByUserId(Long userId) {
    String queryString = "SELECT us FROM UserSurveys us WHERE us.user.id = :userId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("userId", userId);

    return (List<UserSurveys>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link UserSurveysRepository#findByUserIdAndSurveyId(java.lang.Long,java.lang.Long)}.
   */
  public Optional<UserSurveys> findByUserIdAndSurveyId(Long userId, Long surveyId) {
    String queryString = "SELECT us FROM UserSurveys us WHERE us.user.id = :userId AND us.survey.id = :surveyId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("userId", userId);
    query.setParameter("surveyId", surveyId);

    return Optional.ofNullable((UserSurveys) convertOne(query.getSingleResultOrNull(), false, UserSurveys.class));
  }

  /**
   * AOT generated implementation of {@link UserSurveysRepository#findByUserIdWithSurvey(java.lang.Long)}.
   */
  public List<UserSurveys> findByUserIdWithSurvey(Long userId) {
    String queryString = "SELECT us FROM UserSurveys us JOIN FETCH us.survey WHERE us.user.id = :userId";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("userId", userId);

    return (List<UserSurveys>) query.getResultList();
  }
}
