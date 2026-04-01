package com.equipo.backend.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link GenereService}.
 */
@Generated
public class GenereService__BeanDefinitions {
  /**
   * Get the bean definition for 'genereService'.
   */
  public static BeanDefinition getGenereServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(GenereService.class);
    InstanceSupplier<GenereService> instanceSupplier = InstanceSupplier.using(GenereService::new);
    instanceSupplier = instanceSupplier.andThen(GenereService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
