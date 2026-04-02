package org.springframework.boot.web.server.autoconfigure.reactive;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.web.server.autoconfigure.ServerProperties;

/**
 * Bean definitions for {@link ReactiveWebServerConfiguration}.
 */
@Generated
public class ReactiveWebServerConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'reactiveWebServerConfiguration'.
   */
  public static BeanDefinition getReactiveWebServerConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReactiveWebServerConfiguration.class);
    beanDefinition.setInstanceSupplier(ReactiveWebServerConfiguration::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'reactiveWebServerFactoryCustomizer'.
   */
  private static BeanInstanceSupplier<ReactiveWebServerFactoryCustomizer> getReactiveWebServerFactoryCustomizerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<ReactiveWebServerFactoryCustomizer>forFactoryMethod(ReactiveWebServerConfiguration.class, "reactiveWebServerFactoryCustomizer", ServerProperties.class, ObjectProvider.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.web.server.autoconfigure.reactive.ReactiveWebServerConfiguration", ReactiveWebServerConfiguration.class).reactiveWebServerFactoryCustomizer(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'reactiveWebServerFactoryCustomizer'.
   */
  public static BeanDefinition getReactiveWebServerFactoryCustomizerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReactiveWebServerFactoryCustomizer.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.web.server.autoconfigure.reactive.ReactiveWebServerConfiguration");
    beanDefinition.setInstanceSupplier(getReactiveWebServerFactoryCustomizerInstanceSupplier());
    return beanDefinition;
  }
}
