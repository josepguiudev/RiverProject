package com.equipo.backend.service;

import com.equipo.backend.repository.ClientRepository;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.security.JwtService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Bean definitions for {@link AuthService2}.
 */
@Generated
public class AuthService2__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'authService2'.
   */
  private static BeanInstanceSupplier<AuthService2> getAuthServiceInstanceSupplier() {
    return BeanInstanceSupplier.<AuthService2>forConstructor(UserRepository.class, ClientRepository.class, PasswordEncoder.class, JwtService.class)
            .withGenerator((registeredBean, args) -> new AuthService2(args.get(0), args.get(1), args.get(2), args.get(3)));
  }

  /**
   * Get the bean definition for 'authService2'.
   */
  public static BeanDefinition getAuthServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(AuthService2.class);
    beanDefinition.setInstanceSupplier(getAuthServiceInstanceSupplier());
    return beanDefinition;
  }
}
