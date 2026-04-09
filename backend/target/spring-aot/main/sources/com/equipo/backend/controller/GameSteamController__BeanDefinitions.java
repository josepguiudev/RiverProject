package com.equipo.backend.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link GameSteamController}.
 */
@Generated
public class GameSteamController__BeanDefinitions {
  /**
   * Get the bean definition for 'gameSteamController'.
   */
  public static BeanDefinition getGameSteamControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(GameSteamController.class);
    InstanceSupplier<GameSteamController> instanceSupplier = InstanceSupplier.using(GameSteamController::new);
    instanceSupplier = instanceSupplier.andThen(GameSteamController__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
