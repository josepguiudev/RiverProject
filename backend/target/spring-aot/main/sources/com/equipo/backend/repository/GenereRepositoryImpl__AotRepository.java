package com.equipo.backend.repository;

import com.equipo.backend.model.Genere;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link GenereRepository}.
 */
@Generated
public class GenereRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public GenereRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link GenereRepository#findByDescription(java.lang.String)}.
   */
  public Optional<Genere> findByDescription(String description) {
    String queryString = "SELECT g FROM Genere g WHERE g.description = :description";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("description", description);

    return Optional.ofNullable((Genere) convertOne(query.getSingleResultOrNull(), false, Genere.class));
  }
}
