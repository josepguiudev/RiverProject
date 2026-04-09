package com.equipo.backend.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link GameSteamService}.
 */
@Generated
public class GameSteamService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static GameSteamService apply(RegisteredBean registeredBean, GameSteamService instance) {
    AutowiredFieldValueResolver.forRequiredField("gameRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
