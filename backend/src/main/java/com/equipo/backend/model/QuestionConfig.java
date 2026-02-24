package com.equipo.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "question_config")
public class QuestionConfig {
    
    @Id
    private Long id_question;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_question")
    private Question question;

    private String typeName;

    @Column(columnDefinition = "nvarchar(max)")
    private String attributes;



    public Long getId() {
        return this.id_question;
    }

    public void setId(Long id) {
        this.id_question = id;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getAttributes() {
        return this.attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

}
