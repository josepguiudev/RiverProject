package com.equipo.backend;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.equipo.backend.model.*;
import com.equipo.backend.repository.FormSurveyResponseRepsitory;
import com.equipo.backend.service.FormSurveyService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

		//probas moha
		@Bean
		CommandLineRunner initDatabase(FormSurveyService service) {
			return args -> {
				try {
					System.out.println("--- Iniciant Test de Base de Dades ---");

					// 1. Creem l'enquesta principal
					Survey survey = new Survey();
					survey.setName("Enquesta de Videojocs 2026");
					survey.setNumQuestions(1);
					survey.setCreationDate(new Timestamp(System.currentTimeMillis()));

					// 2. Creem una pregunta
					Question q1 = new Question();
					q1.setTextQuestion("Quines plataformes utilitzes per jugar?");
					q1.setSurvey(survey); // Molt important per a la clau forana!

					// 3. Creem les opcions per a la pregunta (Selecció Múltiple)
					Option opt1 = new Option();
					opt1.setTextOpcion("PC (Steam/Epic)");
					opt1.setQuestion(q1);

					Option opt2 = new Option();
					opt2.setTextOpcion("PlayStation 5");
					opt2.setQuestion(q1);

					Option opt3 = new Option();
					opt3.setTextOpcion("Nintendo Switch");
					opt3.setQuestion(q1);

					// Afegim les opcions a la llista de la pregunta
					List<Option> opciones = new ArrayList<>();
					opciones.add(opt1);
					opciones.add(opt2);
					opciones.add(opt3);
					q1.setOption(opciones);

					// Afegim la pregunta a l'enquesta
					survey.getQuestionList().add(q1);

					// 4. Afegim un pagament de prova
					Pago pago = new Pago();
					pago.setEmpresaNombre("River Gaming S.L.");
					pago.setTotalCuota(500.0);
					pago.setPagoEnquesta(1.5);
					pago.setIsEnquestaPagada((byte) 0);
					pago.setSurvey(survey);
					survey.setPago(pago);

					// 5. Guardem tot el conjunt (Gràcies al CascadeType.ALL)
					service.guardarRespuesta(survey);

					System.out.println("--- Test finalitzat amb ÈXIT: Enquesta guardada! ---");
					
				} catch (Exception e) {
					System.err.println("--- ERROR al Test: " + e.getMessage());
					e.printStackTrace();
				}
			};
		}
	}
