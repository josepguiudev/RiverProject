package com.equipo.backend.model;


import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
    @nullable private Timestamp  launchDate;
    @nullable private Date closeDate;
    @nullable private ArrayList<String> questionList;

    @OneToOne
    @JoinColumn(name = "pago")
    private int id_pago;

    @OneToOne
    @JoinColumn(name = "pago_panelista")
    private int id_pago_panelista;

    @OneToMany
    @JoinColumn(name = "genere")
    private ArrayList<Question> genereList;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreationDate() {
        return this.creationDate;
    }

    public void setCreationDate(Timestamp creationDate) {
        this.creationDate = creationDate;
    }

    public Timestamp getLaunchDate() {
        return this.launchDate;
    }

    public void setLaunchDate(Timestamp launchDate) {
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

    public int getId_pago() {
        return this.id_pago;
    }

    public void setId_pago(int id_pago) {
        this.id_pago = id_pago;
    }

    public int getId_pago_panelista() {
        return this.id_pago_panelista;
    }

    public void setId_pago_panelista(int id_pago_panelista) {
        this.id_pago_panelista = id_pago_panelista;
    }

    public ArrayList<Question> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(ArrayList<Question> genereList) {
        this.genereList = genereList;
    }

   
     
    Survey() {  }

    Survey(String name, Timestamp  creationDate, ArrayList<Question> questionlist){
        this.name = name;
        this.creationDate = creationDate;
        this.questionList = questionlist;
    }
}