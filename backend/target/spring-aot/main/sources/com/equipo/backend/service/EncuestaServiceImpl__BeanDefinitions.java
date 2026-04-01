package com.equipo.backend.service;

import com.equipo.backend.repository.OptionRepository;
import com.equipo.backend.repository.QuestionRepository;
import com.equipo.backend.repository.RespuestaRepository;
import com.equipo.backend.repository.SurveyRepository;
import com.equipo.backend.repository.UserRepository;
import com.equipo.backend.repository.UserSurveysRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link EncuestaServiceImpl}.
 */
@Generated
public class EncuestaServiceImpl__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'encuestaServiceImpl'.
   */
  private static BeanInstanceSupplier<EncuestaServiceImpl> getEncuestaServiceImplInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<EncuestaServiceImpl>forConstructor(SurveyRepository.class, QuestionRepository.class, OptionRepository.class, RespuestaRepository.class, UserRepository.class, UserSurveysRepository.class)
            .withGenerator((registeredBean, args) -> new EncuestaServiceImpl(args.get(0), args.get(1), args.get(2), args.get(3), args.get(4), args.get(5)));
  }

  /**
   * Get the bean definition for 'encuestaServiceImpl'.
   */
  public static BeanDefinition getEncuestaServiceImplBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(EncuestaServiceImpl.class);
    beanDefinition.setInstanceSupplier(getEncuestaServiceImplInstanceSupplier());
    return beanDefinition;
  }
}
