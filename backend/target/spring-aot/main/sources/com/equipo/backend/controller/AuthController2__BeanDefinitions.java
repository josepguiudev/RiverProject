package com.equipo.backend.controller;

import com.equipo.backend.service.AuthService2;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link AuthController2}.
 */
@Generated
public class AuthController2__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'authController2'.
   */
  private static BeanInstanceSupplier<AuthController2> getAuthControllerInstanceSupplier() {
    return BeanInstanceSupplier.<AuthController2>forConstructor(AuthService2.class)
            .withGenerator((registeredBean, args) -> new AuthController2(args.get(0)));
  }

  /**
   * Get the bean definition for 'authController2'.
   */
  public static BeanDefinition getAuthControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(AuthController2.class);
    beanDefinition.setInstanceSupplier(getAuthControllerInstanceSupplier());
    return beanDefinition;
  }
}
