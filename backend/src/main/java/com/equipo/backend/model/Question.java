package com.equipo.backend.model;

import com.equipo.backend.model.classesquestiontype.QuestionType;

public class Question {

        private int numQuestion;
        private String textQuestion;
        private QuestionType questionType;

        public int getNumQuestion() {
            return numQuestion;
        }
        public void setNumQuestion(int numQuestion) {
            this.numQuestion = numQuestion;
        }

        public String getTextQuestion() {
            return textQuestion;
        }
        public void setTextQuestion(String textQuestion) {
            this.textQuestion = textQuestion;
        }

        public QuestionType getQuestionType() {
            return questionType;
        }
        public void setQuestionType(QuestionType questionType) {
            this.questionType = questionType;
        }
}
