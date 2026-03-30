package com.equipo.backend.service;

import com.equipo.backend.repository.UserSteamRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link UserSteamService}.
 */
@Generated
public class UserSteamService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userSteamService'.
   */
  private static BeanInstanceSupplier<UserSteamService> getUserSteamServiceInstanceSupplier() {
    return BeanInstanceSupplier.<UserSteamService>forConstructor(UserSteamRepository.class)
            .withGenerator((registeredBean, args) -> new UserSteamService(args.get(0)));
  }

  /**
   * Get the bean definition for 'userSteamService'.
   */
  public static BeanDefinition getUserSteamServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserSteamService.class);
    beanDefinition.setInstanceSupplier(getUserSteamServiceInstanceSupplier());
    return beanDefinition;
  }
}
