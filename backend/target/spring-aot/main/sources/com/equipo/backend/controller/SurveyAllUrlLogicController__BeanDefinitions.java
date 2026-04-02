package com.equipo.backend.controller;

import com.equipo.backend.repository.UserSurveysRepository;
import com.equipo.backend.service.EncuestaService;
import com.equipo.backend.service.FormSurveyService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link SurveyAllUrlLogicController}.
 */
@Generated
public class SurveyAllUrlLogicController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'surveyAllUrlLogicController'.
   */
  private static BeanInstanceSupplier<SurveyAllUrlLogicController> getSurveyAllUrlLogicControllerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<SurveyAllUrlLogicController>forConstructor(FormSurveyService.class, EncuestaService.class, UserSurveysRepository.class)
            .withGenerator((registeredBean, args) -> new SurveyAllUrlLogicController(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'surveyAllUrlLogicController'.
   */
  public static BeanDefinition getSurveyAllUrlLogicControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SurveyAllUrlLogicController.class);
    beanDefinition.setInstanceSupplier(getSurveyAllUrlLogicControllerInstanceSupplier());
    return beanDefinition;
  }
}
