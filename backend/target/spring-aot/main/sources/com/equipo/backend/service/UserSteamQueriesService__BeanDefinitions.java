package com.equipo.backend.service;

import com.equipo.backend.repository.UserSteamQueriesRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link UserSteamQueriesService}.
 */
@Generated
public class UserSteamQueriesService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'userSteamQueriesService'.
   */
  private static BeanInstanceSupplier<UserSteamQueriesService> getUserSteamQueriesServiceInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<UserSteamQueriesService>forConstructor(UserSteamQueriesRepository.class)
            .withGenerator((registeredBean, args) -> new UserSteamQueriesService(args.get(0)));
  }

  /**
   * Get the bean definition for 'userSteamQueriesService'.
   */
  public static BeanDefinition getUserSteamQueriesServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(UserSteamQueriesService.class);
    InstanceSupplier<UserSteamQueriesService> instanceSupplier = getUserSteamQueriesServiceInstanceSupplier();
    instanceSupplier = instanceSupplier.andThen(UserSteamQueriesService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
