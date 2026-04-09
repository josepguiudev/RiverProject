package org.springframework.boot.security.autoconfigure.web.reactive;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ReactiveWebSecurityAutoConfiguration}.
 */
@Generated
public class ReactiveWebSecurityAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'reactiveWebSecurityAutoConfiguration'.
   */
  public static BeanDefinition getReactiveWebSecurityAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReactiveWebSecurityAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(ReactiveWebSecurityAutoConfiguration::new);
    return beanDefinition;
  }
}
