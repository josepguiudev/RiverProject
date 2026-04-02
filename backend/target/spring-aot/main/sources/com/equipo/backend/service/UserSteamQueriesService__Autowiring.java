package com.equipo.backend.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link UserSteamQueriesService}.
 */
@Generated
public class UserSteamQueriesService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static UserSteamQueriesService apply(RegisteredBean registeredBean,
      UserSteamQueriesService instance) {
    AutowiredFieldValueResolver.forRequiredField("repository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
