package com.equipo.backend.controller;

import com.equipo.backend.repository.UserRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link UserController}.
 */
@Generated
public class UserController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userController'.
   */
  private static BeanInstanceSupplier<UserController> getUserControllerInstanceSupplier() {
    return BeanInstanceSupplier.<UserController>forConstructor(UserRepository.class)
            .withGenerator((registeredBean, args) -> new UserController(args.get(0)));
  }

  /**
   * Get the bean definition for 'userController'.
   */
  public static BeanDefinition getUserControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserController.class);
    beanDefinition.setInstanceSupplier(getUserControllerInstanceSupplier());
    return beanDefinition;
  }
}
