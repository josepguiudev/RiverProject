package org.springframework.boot.reactor.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.LazyInitializationExcludeFilter;

/**
 * Bean definitions for {@link ReactorAutoConfiguration}.
 */
@Generated
public class ReactorAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'org.springframework.boot.reactor.autoconfigure.ReactorAutoConfiguration'.
   */
  private static BeanInstanceSupplier<ReactorAutoConfiguration> getReactorAutoConfigurationInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<ReactorAutoConfiguration>forConstructor(ReactorProperties.class)
            .withGenerator((registeredBean, args) -> new ReactorAutoConfiguration(args.get(0)));
  }

  /**
   * Get the bean definition for 'reactorAutoConfiguration'.
   */
  public static BeanDefinition getReactorAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReactorAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(getReactorAutoConfigurationInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean definition for 'reactorAutoConfigurationLazyInitializationExcludeFilter'.
   */
  public static BeanDefinition getReactorAutoConfigurationLazyInitializationExcludeFilterBeanDefinition(
      ) {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReactorAutoConfiguration.class);
    beanDefinition.setTargetType(LazyInitializationExcludeFilter.class);
    beanDefinition.setInstanceSupplier(BeanInstanceSupplier.<LazyInitializationExcludeFilter>forFactoryMethod(ReactorAutoConfiguration.class, "reactorAutoConfigurationLazyInitializationExcludeFilter").withGenerator((registeredBean) -> ReactorAutoConfiguration.reactorAutoConfigurationLazyInitializationExcludeFilter()));
    return beanDefinition;
  }
}
