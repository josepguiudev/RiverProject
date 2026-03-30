package org.springframework.boot.reactor.netty.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.reactor.netty.NettyReactiveWebServerFactory;
import org.springframework.boot.web.server.autoconfigure.ServerProperties;
import org.springframework.core.env.Environment;
import org.springframework.http.client.ReactorResourceFactory;

/**
 * Bean definitions for {@link NettyReactiveWebServerAutoConfiguration}.
 */
@Generated
public class NettyReactiveWebServerAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'nettyReactiveWebServerAutoConfiguration'.
   */
  public static BeanDefinition getNettyReactiveWebServerAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyReactiveWebServerAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(NettyReactiveWebServerAutoConfiguration::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'nettyReactiveWebServerFactory'.
   */
  private static BeanInstanceSupplier<NettyReactiveWebServerFactory> getNettyReactiveWebServerFactoryInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<NettyReactiveWebServerFactory>forFactoryMethod(NettyReactiveWebServerAutoConfiguration.class, "nettyReactiveWebServerFactory", ReactorResourceFactory.class, ObjectProvider.class, ObjectProvider.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.reactor.netty.autoconfigure.NettyReactiveWebServerAutoConfiguration", NettyReactiveWebServerAutoConfiguration.class).nettyReactiveWebServerFactory(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'nettyReactiveWebServerFactory'.
   */
  public static BeanDefinition getNettyReactiveWebServerFactoryBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyReactiveWebServerFactory.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.reactor.netty.autoconfigure.NettyReactiveWebServerAutoConfiguration");
    beanDefinition.setInstanceSupplier(getNettyReactiveWebServerFactoryInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'nettyWebServerFactoryCustomizer'.
   */
  private static BeanInstanceSupplier<NettyReactiveWebServerFactoryCustomizer> getNettyWebServerFactoryCustomizerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<NettyReactiveWebServerFactoryCustomizer>forFactoryMethod(NettyReactiveWebServerAutoConfiguration.class, "nettyWebServerFactoryCustomizer", Environment.class, ServerProperties.class, NettyServerProperties.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.reactor.netty.autoconfigure.NettyReactiveWebServerAutoConfiguration", NettyReactiveWebServerAutoConfiguration.class).nettyWebServerFactoryCustomizer(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'nettyWebServerFactoryCustomizer'.
   */
  public static BeanDefinition getNettyWebServerFactoryCustomizerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyReactiveWebServerFactoryCustomizer.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.reactor.netty.autoconfigure.NettyReactiveWebServerAutoConfiguration");
    beanDefinition.setInstanceSupplier(getNettyWebServerFactoryCustomizerInstanceSupplier());
    return beanDefinition;
  }
}
