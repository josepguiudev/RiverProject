package com.equipo.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "question")
public class Question {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_question;
        private String textQuestion;

        @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
        private QuestionConfig config;
        
        @ManyToOne
        @JoinColumn(name = "id_survey")
        private Survey survey;

        public Long getId() {
            return id_question;
        }

        public void setId(Long id) {
            this.id_question = id;
        }

        public String getTextQuestion() {
            return textQuestion;
        }

        public void setTextQuestion(String textQuestion) {
            this.textQuestion = textQuestion;
        }

        public Survey getSurvey() {
            return this.survey;
        }

        public void setSurvey(Survey Survey) {
            this.survey = Survey;
        }

        public QuestionConfig getConfig() {
        return this.config;
        }

        public void setConfig(QuestionConfig config) {
            this.config = config;
        }



}
