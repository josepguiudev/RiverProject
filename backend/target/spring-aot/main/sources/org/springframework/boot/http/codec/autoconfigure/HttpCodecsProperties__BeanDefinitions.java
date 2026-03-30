package org.springframework.boot.http.codec.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link HttpCodecsProperties}.
 */
@Generated
public class HttpCodecsProperties__BeanDefinitions {
  /**
   * Get the bean definition for 'httpCodecsProperties'.
   */
  public static BeanDefinition getHttpCodecsPropertiesBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(HttpCodecsProperties.class);
    beanDefinition.setInstanceSupplier(HttpCodecsProperties::new);
    return beanDefinition;
  }
}
