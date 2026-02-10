package com.equipo.backend.model;

import com.equipo.backend.model.classesquestiontype.QuestionType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "question")
public class Question {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String textQuestion;

        @OneToOne
        @JoinColumn(name = "question")
        private QuestionType questionType;
        
        @ManyToOne
        @JoinColumn(name = "survey")
        private int idEncuesta;

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

        public QuestionType getQuestionType() {
            return questionType;
        }

        public void setQuestionType(QuestionType questionType) {
            this.questionType = questionType;
        }

        public int getIdEncuesta() {
            return idEncuesta;
        }

        public void setIdEncuesta(int idEncuesta) {
            this.idEncuesta = idEncuesta;
        }



}
