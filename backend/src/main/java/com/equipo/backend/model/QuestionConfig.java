package com.equipo.backend.model;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
@Entity
@Table(name = "question_config")
@Data
public class QuestionConfig {
    
    @Id
    @Column(name = "id_question_config")
    private Long id;

    private String typeName; // SHORT_TEXT, MULTIPLE_CHOICE, etc.

    @Column(name = "is_multiple")
    private Boolean isMultiple; 

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_question")
    @JsonBackReference
    @ToString.Exclude
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

    public Boolean isIsMultiple() {
        return this.isMultiple;
    }

    public Boolean getIsMultiple() {
        return this.isMultiple;
    }

    public void setIsMultiple(Boolean isMultiple) {
        this.isMultiple = isMultiple;
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
    

    public QuestionConfig(Long id, String typeName, Boolean isMultiple, Question question, String attributes) {
        this.id = id;
        this.typeName = typeName;
        this.isMultiple = isMultiple;
        this.question = question;
        this.attributes = attributes;
    }


}
