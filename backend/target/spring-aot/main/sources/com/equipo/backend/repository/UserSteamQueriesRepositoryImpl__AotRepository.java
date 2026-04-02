package com.equipo.backend.repository;

import com.equipo.backend.model.UserSteamQueries;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.List;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link UserSteamQueriesRepository}.
 */
@Generated
public class UserSteamQueriesRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public UserSteamQueriesRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link UserSteamQueriesRepository#findByType(int)}.
   */
  public List<UserSteamQueries> findByType(int type) {
    String queryString = "SELECT u FROM UserSteamQueries u WHERE u.type = :type";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("type", type);

    return (List<UserSteamQueries>) query.getResultList();
  }
}
