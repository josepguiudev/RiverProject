package org.springframework.boot.netty.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.LazyInitializationExcludeFilter;

/**
 * Bean definitions for {@link NettyAutoConfiguration}.
 */
@Generated
public class NettyAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'org.springframework.boot.netty.autoconfigure.NettyAutoConfiguration'.
   */
  private static BeanInstanceSupplier<NettyAutoConfiguration> getNettyAutoConfigurationInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<NettyAutoConfiguration>forConstructor(NettyProperties.class)
            .withGenerator((registeredBean, args) -> new NettyAutoConfiguration(args.get(0)));
  }

  /**
   * Get the bean definition for 'nettyAutoConfiguration'.
   */
  public static BeanDefinition getNettyAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(getNettyAutoConfigurationInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean definition for 'nettyAutoConfigurationLazyInitializationExcludeFilter'.
   */
  public static BeanDefinition getNettyAutoConfigurationLazyInitializationExcludeFilterBeanDefinition(
      ) {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyAutoConfiguration.class);
    beanDefinition.setTargetType(LazyInitializationExcludeFilter.class);
    beanDefinition.setInstanceSupplier(BeanInstanceSupplier.<LazyInitializationExcludeFilter>forFactoryMethod(NettyAutoConfiguration.class, "nettyAutoConfigurationLazyInitializationExcludeFilter").withGenerator((registeredBean) -> NettyAutoConfiguration.nettyAutoConfigurationLazyInitializationExcludeFilter()));
    return beanDefinition;
  }
}
