package com.equipo.backend.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link GenereController}.
 */
@Generated
public class GenereController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static GenereController apply(RegisteredBean registeredBean, GenereController instance) {
    AutowiredFieldValueResolver.forRequiredField("genereService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
