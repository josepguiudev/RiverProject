package com.equipo.backend.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link GameSteamController}.
 */
@Generated
public class GameSteamController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static GameSteamController apply(RegisteredBean registeredBean,
      GameSteamController instance) {
    AutowiredFieldValueResolver.forRequiredField("gameService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
