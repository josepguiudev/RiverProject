package com.equipo.backend.model;

import com.equipo.backend.model.classesquestiontype.QuestionType;
import com.equipo.backend.model.classesquestiontype.typeMultipleOption;
import com.equipo.backend.model.classesquestiontype.typeNumeric;
import com.equipo.backend.model.classesquestiontype.typeNumericEscala;
import com.equipo.backend.model.classesquestiontype.typeSingleOption;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Scanner;



public class SurveyCreator {

   int numQuestions;
   
	public int getNumQuestions() {
    return numQuestions;
}
   public void setNumQuestions(int numQuestions) {
    this.numQuestions = numQuestions;
   }
    public static void main(String[] args) {
		
        //creacion del formulario
            surveyCreator(5);



	}
    public static Survey surveyCreator(int numPreg){
        ArrayList<Question> list = new ArrayList<Question>();
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Elija un nombre o codigo para la encuesta: ");
            String surveyName = scanner.nextLine();



        for (int i = 0; i < numPreg; i++) {
            Question q = new Question();
            System.out.print("introduce el texto de la pregunta: ");
            q.setTextQuestion(scanner.nextLine());
            System.out.println("elige el tipo de pregunta");
            System.out.println("1- Numerica");
            System.out.println("2- Escala con respuesta numerica");
            System.out.println("3- Una respuesta de un listado");
            System.out.println("4- Multiples respuestas de un listado");
            System.out.print("Numero: ");
            int respuesta = scanner.nextInt();
            QuestionType question;

            switch (respuesta) {
                case 1:
                    question = new typeNumeric();
                    break;
                case 2:
                    typeNumericEscala thisNumericEscalaQuestion = new typeNumericEscala();
                    System.out.println("introduce el maximo i el minimo");
                    System.out.print("Max: ");
                    thisNumericEscalaQuestion.setMaxValue(scanner.nextInt());
                    System.out.print("Min: ");
                    thisNumericEscalaQuestion.setMinValue(scanner.nextInt());
                    question = thisNumericEscalaQuestion;
                    break;
                case 3:
                    typeSingleOption thisSingleOptionQuestion = new typeSingleOption();
                    ArrayList<String> listOptions = new ArrayList<String>();
                    System.out.println("Quantas opciones quieres introducir?");
                    System.out.print("Numero de Opciones: ");
                    for (int j = 0; j < scanner.nextInt(); j++) {
                        System.out.println("Opcion " + (j+1) + ": ");
                        listOptions.add(scanner.nextLine());
                    }
                    thisSingleOptionQuestion.setListOptions(listOptions);
                    question = thisSingleOptionQuestion;
                    break;
                case 4:
                    typeMultipleOption thisMultiOptionQuestion = new typeMultipleOption();
                    ArrayList<String> listOptionsMulti = new ArrayList<String>();
                    System.out.println("Quantas opciones quieres introducir?");
                    System.out.print("Numero de Opciones: ");
                    for (int j = 0; j < scanner.nextInt(); j++) {
                        System.out.println("Opcion " + (j+1) + ": ");
                        listOptionsMulti.add(scanner.nextLine());
                    }
                    thisMultiOptionQuestion.setListOptions(listOptionsMulti);
                    question = thisMultiOptionQuestion;
                    break;
            
                default:
                    break;
            }

            list.add(q);
            }
            Timestamp creationDate = new Timestamp(System.currentTimeMillis());

            Survey newSurvey = new Survey(surveyName,creationDate, list);
            return newSurvey;
        }
    }
}

