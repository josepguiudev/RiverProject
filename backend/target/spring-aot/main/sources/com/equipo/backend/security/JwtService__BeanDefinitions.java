package com.equipo.backend.security;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link JwtService}.
 */
@Generated
public class JwtService__BeanDefinitions {
  /**
   * Get the bean definition for 'jwtService'.
   */
  public static BeanDefinition getJwtServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(JwtService.class);
    beanDefinition.setInstanceSupplier(JwtService::new);
    return beanDefinition;
  }
}
