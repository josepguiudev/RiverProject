package com.equipo.backend.model;


import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "question_config")
@Data
public class QuestionConfig {
    
    @Id
    private Long id;

    private String typeName;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Question question;

    @Column(columnDefinition = "nvarchar(max)")
    private String attributes;




    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getAttributes() {
        return this.attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }


    public QuestionConfig() {
    }

    public QuestionConfig(Long id, String typeName, Question question, String attributes) {
        this.id = id;
        this.typeName = typeName;
        this.question = question;
        this.attributes = attributes;
    }


}
