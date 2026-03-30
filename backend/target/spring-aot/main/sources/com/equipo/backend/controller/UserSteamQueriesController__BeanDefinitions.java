package com.equipo.backend.controller;

import com.equipo.backend.service.UserSteamQueriesService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link UserSteamQueriesController}.
 */
@Generated
public class UserSteamQueriesController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userSteamQueriesController'.
   */
  private static BeanInstanceSupplier<UserSteamQueriesController> getUserSteamQueriesControllerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<UserSteamQueriesController>forConstructor(UserSteamQueriesService.class)
            .withGenerator((registeredBean, args) -> new UserSteamQueriesController(args.get(0)));
  }

  /**
   * Get the bean definition for 'userSteamQueriesController'.
   */
  public static BeanDefinition getUserSteamQueriesControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserSteamQueriesController.class);
    InstanceSupplier<UserSteamQueriesController> instanceSupplier = getUserSteamQueriesControllerInstanceSupplier();
    instanceSupplier = instanceSupplier.andThen(UserSteamQueriesController__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
