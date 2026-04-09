package com.equipo.backend.repository;

import com.equipo.backend.model.Survey;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.List;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link SurveyRepository}.
 */
@Generated
public class SurveyRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public SurveyRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link SurveyRepository#findAllSurveys()}.
   */
  public List<Survey> findAllSurveys() {
    String queryString = "SELECT s FROM Survey s";
    Query query = this.entityManager.createQuery(queryString);

    return (List<Survey>) query.getResultList();
  }
}
