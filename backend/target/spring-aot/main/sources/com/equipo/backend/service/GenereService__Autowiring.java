package com.equipo.backend.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link GenereService}.
 */
@Generated
public class GenereService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static GenereService apply(RegisteredBean registeredBean, GenereService instance) {
    AutowiredFieldValueResolver.forRequiredField("genereRepository").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("gameRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
