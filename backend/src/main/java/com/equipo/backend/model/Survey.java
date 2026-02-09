package com.equipo.backend.model;


import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.Data;


@Entity
@Table(name = "survey")
@Data

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Timestamp  creationDate;
    private Timestamp  launchDate;
    @nullable private Date closeDate;
    private ArrayList<Question> questionList;
    private int pago;

    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Timestamp  getCreationDate() {
        return this.creationDate;
    }
    public void setCreationDate(Timestamp  creationDate) {
        this.creationDate = creationDate;
    }

    public Timestamp  getLaunchDate() {
        return this.launchDate;
    }
    public void setLaunchDate(Timestamp  launchDate) {
        this.launchDate = launchDate;
    }

    public Date getCloseDate() {
        return this.closeDate;
    }
    public void setCloseDate(Date closeDate) {
        this.closeDate = closeDate;
    }

    public ArrayList<Question> getQuestionList() {
        return this.questionList;
    }
    public void setQuestionList(ArrayList<Question> questionList) {
        this.questionList = questionList;
    }
     
    public int getPago() {
        return this.pago;
    }
    public void setPago(int pago) {
        this.pago = pago;
    }
     
    Survey() {  }

    Survey(String name, Timestamp  creationDate, ArrayList<Question> questionlist){
        this.name = name;
        this.creationDate = creationDate;
        this.questionList = questionlist;
    }
}