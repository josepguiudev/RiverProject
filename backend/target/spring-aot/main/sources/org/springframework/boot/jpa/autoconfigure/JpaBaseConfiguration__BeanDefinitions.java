package org.springframework.boot.jpa.autoconfigure;

import java.lang.String;
import java.util.List;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.orm.jpa.persistenceunit.PersistenceManagedTypes;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewInterceptor;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Bean definitions for {@link JpaBaseConfiguration}.
 */
@Generated
public class JpaBaseConfiguration__BeanDefinitions {
  /**
   * Bean definitions for {@link JpaBaseConfiguration.JpaWebConfiguration}.
   */
  @Generated
  public static class JpaWebConfiguration {
    /**
     * Get the bean instance supplier for 'org.springframework.boot.jpa.autoconfigure.JpaBaseConfiguration$JpaWebConfiguration'.
     */
    private static BeanInstanceSupplier<JpaBaseConfiguration.JpaWebConfiguration> getJpaWebConfigurationInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<JpaBaseConfiguration.JpaWebConfiguration>forConstructor(JpaProperties.class)
              .withGenerator((registeredBean, args) -> new JpaBaseConfiguration.JpaWebConfiguration(args.get(0)));
    }

    /**
     * Get the bean definition for 'jpaWebConfiguration'.
     */
    public static BeanDefinition getJpaWebConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JpaBaseConfiguration.JpaWebConfiguration.class);
      beanDefinition.setInstanceSupplier(getJpaWebConfigurationInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'openEntityManagerInViewInterceptor'.
     */
    private static BeanInstanceSupplier<OpenEntityManagerInViewInterceptor> getOpenEntityManagerInViewInterceptorInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<OpenEntityManagerInViewInterceptor>forFactoryMethod(JpaBaseConfiguration.JpaWebConfiguration.class, "openEntityManagerInViewInterceptor")
              .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.jpa.autoconfigure.JpaBaseConfiguration$JpaWebConfiguration", JpaBaseConfiguration.JpaWebConfiguration.class).openEntityManagerInViewInterceptor());
    }

    /**
     * Get the bean definition for 'openEntityManagerInViewInterceptor'.
     */
    public static BeanDefinition getOpenEntityManagerInViewInterceptorBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(OpenEntityManagerInViewInterceptor.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.jpa.autoconfigure.JpaBaseConfiguration$JpaWebConfiguration");
      beanDefinition.setInstanceSupplier(getOpenEntityManagerInViewInterceptorInstanceSupplier());
      return beanDefinition;
    }

    /**
     * Get the bean instance supplier for 'openEntityManagerInViewInterceptorConfigurer'.
     */
    private static BeanInstanceSupplier<WebMvcConfigurer> getOpenEntityManagerInViewInterceptorConfigurerInstanceSupplier(
        ) {
      return BeanInstanceSupplier.<WebMvcConfigurer>forFactoryMethod(JpaBaseConfiguration.JpaWebConfiguration.class, "openEntityManagerInViewInterceptorConfigurer", OpenEntityManagerInViewInterceptor.class)
              .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.jpa.autoconfigure.JpaBaseConfiguration$JpaWebConfiguration", JpaBaseConfiguration.JpaWebConfiguration.class).openEntityManagerInViewInterceptorConfigurer(args.get(0)));
    }

    /**
     * Get the bean definition for 'openEntityManagerInViewInterceptorConfigurer'.
     */
    public static BeanDefinition getOpenEntityManagerInViewInterceptorConfigurerBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(WebMvcConfigurer.class);
      beanDefinition.setFactoryBeanName("org.springframework.boot.jpa.autoconfigure.JpaBaseConfiguration$JpaWebConfiguration");
      beanDefinition.setInstanceSupplier(getOpenEntityManagerInViewInterceptorConfigurerInstanceSupplier());
      return beanDefinition;
    }
  }

  /**
   * Bean definitions for {@link JpaBaseConfiguration.PersistenceManagedTypesConfiguration}.
   */
  @Generated
  public static class PersistenceManagedTypesConfiguration {
    /**
     * Get the bean definition for 'persistenceManagedTypesConfiguration'.
     */
    public static BeanDefinition getPersistenceManagedTypesConfigurationBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JpaBaseConfiguration.PersistenceManagedTypesConfiguration.class);
      beanDefinition.setInstanceSupplier(JpaBaseConfiguration.PersistenceManagedTypesConfiguration::new);
      return beanDefinition;
    }

    /**
     * Get the bean instance for 'persistenceManagedTypes'.
     */
    private static PersistenceManagedTypes getPersistenceManagedTypesInstance() {
      List<String> managedClassNames = List.of("com.equipo.backend.model.BonoTotal", "com.equipo.backend.model.Category", "com.equipo.backend.model.Client", "com.equipo.backend.model.Game", "com.equipo.backend.model.Genere", "com.equipo.backend.model.Logro", "com.equipo.backend.model.OpcionRespuesta", "com.equipo.backend.model.Option", "com.equipo.backend.model.PagoPanelista", "com.equipo.backend.model.PreguntaOpcion", "com.equipo.backend.model.Question", "com.equipo.backend.model.QuestionConfig", "com.equipo.backend.model.Respuesta", "com.equipo.backend.model.Survey", "com.equipo.backend.model.User", "com.equipo.backend.model.UserGame", "com.equipo.backend.model.UserSteam", "com.equipo.backend.model.UserSteamQueries", "com.equipo.backend.model.UserSurveys");
      List<String> managedPackages = List.of();
      return PersistenceManagedTypes.of(managedClassNames, managedPackages);
    }

    /**
     * Get the bean definition for 'persistenceManagedTypes'.
     */
    public static BeanDefinition getPersistenceManagedTypesBeanDefinition() {
      RootBeanDefinition beanDefinition = new RootBeanDefinition(JpaBaseConfiguration.PersistenceManagedTypesConfiguration.class);
      beanDefinition.setTargetType(PersistenceManagedTypes.class);
      beanDefinition.setPrimary(true);
      beanDefinition.setInstanceSupplier(PersistenceManagedTypesConfiguration::getPersistenceManagedTypesInstance);
      return beanDefinition;
    }
  }
}
