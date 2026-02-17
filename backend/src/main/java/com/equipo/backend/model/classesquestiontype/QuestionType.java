package com.equipo.backend.model.classesquestiontype;

import jakarta.persistence.*;

@Entity
@Table(name = "question_type")
public abstract class QuestionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String typeName;
    
    
}
