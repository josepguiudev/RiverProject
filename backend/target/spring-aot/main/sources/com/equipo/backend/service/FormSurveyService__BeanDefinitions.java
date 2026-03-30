package com.equipo.backend.service;

import com.equipo.backend.repository.SurveyRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link FormSurveyService}.
 */
@Generated
public class FormSurveyService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'formSurveyService'.
   */
  private static BeanInstanceSupplier<FormSurveyService> getFormSurveyServiceInstanceSupplier() {
    return BeanInstanceSupplier.<FormSurveyService>forConstructor(SurveyRepository.class)
            .withGenerator((registeredBean, args) -> new FormSurveyService(args.get(0)));
  }

  /**
   * Get the bean definition for 'formSurveyService'.
   */
  public static BeanDefinition getFormSurveyServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(FormSurveyService.class);
    beanDefinition.setInstanceSupplier(getFormSurveyServiceInstanceSupplier());
    return beanDefinition;
  }
}
