package com.equipo.backend.model;


import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

import lombok.Data;


@Entity
@Table(name = "survey")
@Data

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_survey;

    private int numQuestions;
    private String name;
    private Timestamp  creationDate;
    @Column(nullable = true) private Timestamp  launchDate;
    @Column(nullable = true) private Date closeDate;
    
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    private List<Question> questionList = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago", nullable = true)
    private Pago pago;

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago_panelista", nullable = true)
    private PagoPanelista pagoPanelista;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    private List<Genere> genereList = new ArrayList<>();


    public Long getId() {
        return this.id_survey;
    }

    public void setId(Long id) {
        this.id_survey = id;
    }

    public int getNumQuestions() {
        return this.numQuestions;
    }

    public void setNumQuestions(int numQuestions) {
        this.numQuestions = numQuestions;
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

    public List<Question> getQuestionList() {
        return this.questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }

    public Pago getPago() {
        return this.pago;
    }

    public void setPago(Pago pago) {
        this.pago = pago;
    }

    public PagoPanelista getPagoPanelista() {
        return this.pagoPanelista;
    }

    public void setPagoPanelista(PagoPanelista pagoPanelista) {
        this.pagoPanelista = pagoPanelista;
    }


    public Long getId_survey() {
        return this.id_survey;
    }

    public void setId_survey(Long id_survey) {
        this.id_survey = id_survey;
    }

    public List<Genere> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(List<Genere> genereList) {
        this.genereList = genereList;
    }

 
     
    public Survey() {  }

    Survey(String name, Timestamp  creationDate, ArrayList<Question> questionlist){
        this.name = name;
        this.creationDate = creationDate;
        this.questionList = questionlist;
    }
}