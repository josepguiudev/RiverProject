package com.equipo.backend.model;


import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import lombok.Data;


@Entity
@Table(name = "survey")
@Data

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numQuestions;
    private int numUsers;
    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime  creationDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime  launchDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime closeDate;
    
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Question> questionList = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago", nullable = true)
    private Pago pago = null;

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago_panelista", nullable = true)
    private PagoPanelista pagoPanelista;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "survey_genere",
        joinColumns = @JoinColumn(name = "id_survey"),
        inverseJoinColumns = @JoinColumn(name = "id_genere")
    )
    private List<Genere> genereList = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "survey_category",
        joinColumns = @JoinColumn(name = "id_survey"),
        inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    private List<Category> categoryList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_client")
    @JsonBackReference
    private Client client;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSurveys> userSurveysList = new ArrayList<>();


    public void setCreationDate(LocalDateTime timestamp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreationDate'");
    }

    public void setCreationDate(Timestamp timestamp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreationDate'");
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumQuestions() {
        return this.numQuestions;
    }

    public void setNumQuestions(int numQuestions) {
        this.numQuestions = numQuestions;
    }

    public int getNumUsers() {
        return this.numUsers;
    }

    public void setNumUsers(int numUsers) {
        this.numUsers = numUsers;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreationDate() {
        return this.creationDate;
    }


    public LocalDateTime getLaunchDate() {
        return this.launchDate;
    }

    public void setLaunchDate(LocalDateTime launchDate) {
        this.launchDate = launchDate;
    }

    public LocalDateTime getCloseDate() {
        return this.closeDate;
    }

    public void setCloseDate(LocalDateTime closeDate) {
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

    public List<Genere> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(List<Genere> genereList) {
        this.genereList = genereList;
    }

    public Survey() {
    }


    public Survey(Long id, int numQuestions, int numUsers, String name, LocalDateTime creationDate, LocalDateTime launchDate, LocalDateTime closeDate, List<Question> questionList, Pago pago, PagoPanelista pagoPanelista, List<Genere> genereList) {
        this.id = id;
        this.numQuestions = numQuestions;
        this.numUsers = numUsers;
        this.name = name;
        this.creationDate = creationDate;
        this.launchDate = launchDate;
        this.closeDate = closeDate;
        this.questionList = questionList;
        this.pago = pago;
        this.pagoPanelista = pagoPanelista;
        this.genereList = genereList;
    }

}