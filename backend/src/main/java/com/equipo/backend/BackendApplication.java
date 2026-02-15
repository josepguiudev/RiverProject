package com.equipo.backend;

import java.sql.Timestamp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.equipo.backend.model.*;
import com.equipo.backend.repository.FormSurveyResponseRepsitory;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

		//probas moha
		@Bean
		CommandLineRunner testDatabase(FormSurveyResponseRepsitory surveyRepo) {
    	return args -> {
        // 1. Creem l'enquesta
				Survey s = new Survey();
				s.setName("Enquesta de Satisfacció");
				s.setCreationDate(new Timestamp(System.currentTimeMillis()));

				// 2. Creem una pregunta
				Question q = new Question();
				q.setTextQuestion("T'agrada la nostra App?");
				q.setSurvey(s); // Vinculem amb l'enquesta

				// 3. Creem la configuració (AQUÍ VA EL JSON)
				QuestionConfig config = new QuestionConfig();
				config.setTypeName("SINGLE_CHOICE");
				// Escrivim el JSON com a String (com que és nvarchar(max) a la BD)
				config.setAttributes("{\"options\": [\"Sí\", \"No\"], \"required\": true}");
				
				// 4. Vinculem la config amb la pregunta
				config.setQuestion(q);
				q.setConfig(config);

				// 5. Afegim la pregunta a l'enquesta
				s.getQuestionList().add(q);

				// 6. GUARDEM NOMÉS L'ENQUESTA (El cascade farà la resta)
				surveyRepo.save(s);

				System.out.println("--- Dades de prova guardades amb èxit! ---");
			};

	}

}
