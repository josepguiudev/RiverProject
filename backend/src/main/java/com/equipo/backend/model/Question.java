package com.equipo.backend.model;

import com.equipo.backend.model.classesquestiontype.QuestionType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "question")
public class Question {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String textQuestion;

        //@OneToOne
        //@JoinColumn(name = "question_type")
        private String questionType;
        
        @ManyToOne
        @JoinColumn(name = "id_survey")
        private Survey survey;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTextQuestion() {
            return textQuestion;
        }

        public void setTextQuestion(String textQuestion) {
            this.textQuestion = textQuestion;
        }

        public String getQuestionType() {
            return questionType;
        }

        public void setQuestionType(String questionType) {
            this.questionType = questionType;
        }


        public Survey getSurvey() {
            return this.survey;
        }

        public void setSurvey(Survey Survey) {
            this.survey = Survey;
        }




}
