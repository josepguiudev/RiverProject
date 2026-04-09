package com.equipo.backend.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link GameSteamService}.
 */
@Generated
public class GameSteamService__BeanDefinitions {
  /**
   * Get the bean definition for 'gameSteamService'.
   */
  public static BeanDefinition getGameSteamServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(GameSteamService.class);
    InstanceSupplier<GameSteamService> instanceSupplier = InstanceSupplier.using(GameSteamService::new);
    instanceSupplier = instanceSupplier.andThen(GameSteamService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
