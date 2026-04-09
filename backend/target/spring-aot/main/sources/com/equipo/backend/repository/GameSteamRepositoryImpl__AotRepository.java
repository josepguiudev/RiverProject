package com.equipo.backend.repository;

import com.equipo.backend.model.Game;
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
 * AOT generated JPA repository implementation for {@link GameSteamRepository}.
 */
@Generated
public class GameSteamRepositoryImpl__AotRepository extends AotRepositoryFragmentSupport {
  private final RepositoryFactoryBeanSupport.FragmentCreationContext context;

  private final EntityManager entityManager;

  public GameSteamRepositoryImpl__AotRepository(EntityManager entityManager,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(QueryEnhancerSelector.DEFAULT_SELECTOR, context);
    this.entityManager = entityManager;
    this.context = context;
  }

  /**
   * AOT generated implementation of {@link GameSteamRepository#findAllByAppidIn(java.util.List)}.
   */
  public List<Game> findAllByAppidIn(List<Long> appids) {
    String queryString = "SELECT g FROM Game g WHERE g.appid IN :appids";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("appids", appids);

    return (List<Game>) query.getResultList();
  }

  /**
   * AOT generated implementation of {@link GameSteamRepository#findByAppid(java.lang.Long)}.
   */
  public Optional<Game> findByAppid(Long appid) {
    String queryString = "SELECT g FROM Game g WHERE g.appid = :appid";
    Query query = this.entityManager.createQuery(queryString);
    query.setParameter("appid", appid);

    return Optional.ofNullable((Game) convertOne(query.getSingleResultOrNull(), false, Game.class));
  }
}
