package org.springframework.boot.reactor.netty.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link NettyServerProperties}.
 */
@Generated
public class NettyServerProperties__BeanDefinitions {
  /**
   * Get the bean definition for 'nettyServerProperties'.
   */
  public static BeanDefinition getNettyServerPropertiesBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(NettyServerProperties.class);
    beanDefinition.setInstanceSupplier(NettyServerProperties::new);
    return beanDefinition;
  }
}
