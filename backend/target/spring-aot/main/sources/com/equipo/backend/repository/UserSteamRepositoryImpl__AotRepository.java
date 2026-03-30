package com.equipo.backend.repository;

import com.equipo.backend.model.UserSteam;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.lang.String;
import java.util.Optional;
import org.springframework.aot.generate.Generated;
import org.springframework.data.jpa.repository.aot.AotRepositoryFragmentSupport;
import org.springframework.data.jpa.repository.query.QueryEnhancerSelector;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated JPA repository implementation for {@link UserSteamRepository}.
 */
@Generated
public class UserSteamRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public UserSteamRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link UserSteamRepository#findBySteamid(java.lang.String)}.
   */
  public Optional<UserSteam> findBySteamid(String steamid) {
    String queryString = "SELECT u FROM UserSteam u WHERE u.steamid = :steamid";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("steamid", steamid);

    return Optional.ofNullable((UserSteam) convertOne(query.getSingleResultOrNull(), false, UserSteam.class));
  }
}
