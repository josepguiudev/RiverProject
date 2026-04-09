package com.equipo.backend.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link GenereController}.
 */
@Generated
public class GenereController__BeanDefinitions {
  /**
   * Get the bean definition for 'genereController'.
   */
  public static BeanDefinition getGenereControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(GenereController.class);
    InstanceSupplier<GenereController> instanceSupplier = InstanceSupplier.using(GenereController::new);
    instanceSupplier = instanceSupplier.andThen(GenereController__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
