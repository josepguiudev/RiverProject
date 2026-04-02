package com.equipo.backend.controller;

import com.equipo.backend.service.UserSteamService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link UserSteamController}.
 */
@Generated
public class UserSteamController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userSteamController'.
   */
  private static BeanInstanceSupplier<UserSteamController> getUserSteamControllerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<UserSteamController>forConstructor(UserSteamService.class)
            .withGenerator((registeredBean, args) -> new UserSteamController(args.get(0)));
  }

  /**
   * Get the bean definition for 'userSteamController'.
   */
  public static BeanDefinition getUserSteamControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserSteamController.class);
    beanDefinition.setInstanceSupplier(getUserSteamControllerInstanceSupplier());
    return beanDefinition;
  }
}
