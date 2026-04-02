package com.equipo.backend.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link UserSteamQueriesController}.
 */
@Generated
public class UserSteamQueriesController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static UserSteamQueriesController apply(RegisteredBean registeredBean,
      UserSteamQueriesController instance) {
    AutowiredFieldValueResolver.forRequiredField("userSteamQueriesService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
