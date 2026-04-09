package org.springframework.boot.http.codec.autoconfigure;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.http.codec.CodecCustomizer;
import tools.jackson.databind.json.JsonMapper;

/**
 * Bean definitions for {@link CodecsAutoConfiguration}.
 */
@Generated
public class CodecsAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'codecsAutoConfiguration'.
   */
  public static BeanDefinition getCodecsAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CodecsAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(CodecsAutoConfiguration::new);
    return beanDefinition;
  }

  /**
   * Bean definitions for {@link CodecsAutoConfiguration.JacksonJsonCodecConfiguration}.
   */
  @Generated
  public static class JacksonJsonCodecConfiguration {
    /**
     * Get the bean definition for 'jacksonJsonCodecConfiguration'.
     */
    public static BeanDefinition getJacksonJsonCodecConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(CodecsAutoConfiguration.JacksonJsonCodecConfiguration.class);
      beanDefinition.setInstanceSupplier(CodecsAutoConfiguration.JacksonJsonCodecConfiguration::new);
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'jacksonCodecCustomizer'.
     */
    private static BeanInstanceSupplier<CodecCustomizer> getJacksonCodecCustomizerInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<CodecCustomizer>forFactoryMethod(CodecsAutoConfiguration.JacksonJsonCodecConfiguration.class, "jacksonCodecCustomizer", JsonMapper.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.http.codec.autoconfigure.CodecsAutoConfiguration$JacksonJsonCodecConfiguration", CodecsAutoConfiguration.JacksonJsonCodecConfiguration.class).jacksonCodecCustomizer(args.get(0)));
    }

    /**
     * Get the bean definition for 'jacksonCodecCustomizer'.
     */
    public static BeanDefinition getJacksonCodecCustomizerBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(CodecCustomizer.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.http.codec.autoconfigure.CodecsAutoConfiguration$JacksonJsonCodecConfiguration");
      beanDefinition.setInstanceSupplier(getJacksonCodecCustomizerInstanceSupplier());
      return beanDefinition;
    }
  }

  /**
   * Bean definitions for {@link CodecsAutoConfiguration.DefaultCodecsConfiguration}.
   */
  @Generated
  public static class DefaultCodecsConfiguration {
    /**
     * Get the bean definition for 'defaultCodecsConfiguration'.
     */
    public static BeanDefinition getDefaultCodecsConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(CodecsAutoConfiguration.DefaultCodecsConfiguration.class);
      beanDefinition.setInstanceSupplier(CodecsAutoConfiguration.DefaultCodecsConfiguration::new);
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'defaultCodecCustomizer'.
     */
    private static BeanInstanceSupplier<CodecsAutoConfiguration.DefaultCodecsConfiguration.DefaultCodecCustomizer> getDefaultCodecCustomizerInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<CodecsAutoConfiguration.DefaultCodecsConfiguration.DefaultCodecCustomizer>forFactoryMethod(CodecsAutoConfiguration.DefaultCodecsConfiguration.class, "defaultCodecCustomizer", HttpCodecsProperties.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.http.codec.autoconfigure.CodecsAutoConfiguration$DefaultCodecsConfiguration", CodecsAutoConfiguration.DefaultCodecsConfiguration.class).defaultCodecCustomizer(args.get(0)));
    }

    /**
     * Get the bean definition for 'defaultCodecCustomizer'.
     */
    public static BeanDefinition getDefaultCodecCustomizerBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(CodecsAutoConfiguration.DefaultCodecsConfiguration.DefaultCodecCustomizer.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.http.codec.autoconfigure.CodecsAutoConfiguration$DefaultCodecsConfiguration");
      beanDefinition.setInstanceSupplier(getDefaultCodecCustomizerInstanceSupplier());
      return beanDefinition;
    }
  }
}
