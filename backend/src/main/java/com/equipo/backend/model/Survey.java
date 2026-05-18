package com.equipo.backend.model;


import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import lombok.Data;
import lombok.ToString;


@Entity
@Table(name = "survey")
@Data

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_survey")
    private Long id;
    
    @JsonProperty("numQuestions")
    private Integer numQuestions;
    
    private Integer numUsers;
    
    @JsonProperty("name")
    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime  creationDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime  launchDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime closeDate;
    
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    @BatchSize(size = 20)
    @JsonManagedReference
    @ToString.Exclude
    private List<Question> questionList = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_pago_panelista", nullable = true)
    @JsonManagedReference
    private PagoPanelista pagoPanelista;

    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(
        name = "survey_genere",
        joinColumns = @JoinColumn(name = "id_survey"),
        inverseJoinColumns = @JoinColumn(name = "id_genere")
    )
    @ToString.Exclude
    private List<Genere> genereList = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(
        name = "survey_category",
        joinColumns = @JoinColumn(name = "id_survey"),
        inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    @ToString.Exclude
    private List<Category> categoryList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client")
    @JsonIgnoreProperties("surveys")
    private Client client;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<UserSurveys> userSurveysList = new ArrayList<>();

    private Boolean isPublished = false;
    private String urlGraficoSuperset;

    public void setCreationDate(LocalDateTime timestamp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreationDate'");
    }


    public Boolean isIsPublished() {
        return this.isPublished;
    }

    public Boolean getIsPublished() {
        return this.isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumQuestions() {
        if (this.questionList != null && !this.questionList.isEmpty()) {
            return this.questionList.size();
        }
        return this.numQuestions;
    }

    public void setNumQuestions(int numQuestions) {
        this.numQuestions = numQuestions;
    }

    public Integer getNumUsers() {
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


    public List<Category> getCategoryList() {
        return this.categoryList;
    }

    public void setCategoryList(List<Category> categoryList) {
        this.categoryList = categoryList;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<UserSurveys> getUserSurveysList() {
        return this.userSurveysList;
    }

    public void setUserSurveysList(List<UserSurveys> userSurveysList) {
        this.userSurveysList = userSurveysList;
    }


    public String getUrlGraficoSuperset() {
        return this.urlGraficoSuperset;
    }

    public void setUrlGraficoSuperset(String urlGraficoSuperset) {
        this.urlGraficoSuperset = urlGraficoSuperset;
    }

    public Survey() {
    }


    public Survey(Long id, Integer numQuestions, Integer numUsers, String name, LocalDateTime creationDate, LocalDateTime launchDate, LocalDateTime closeDate, List<Question> questionList, PagoPanelista pagoPanelista, List<Genere> genereList, List<Category> categoryList, Client client, List<UserSurveys> userSurveysList, Boolean isPublished, String urlGraficoSuperset) {
        this.id = id;
        this.numQuestions = numQuestions;
        this.numUsers = numUsers;
        this.name = name;
        this.creationDate = creationDate;
        this.launchDate = launchDate;
        this.closeDate = closeDate;
        this.questionList = questionList;
        this.pagoPanelista = pagoPanelista;
        this.genereList = genereList;
        this.categoryList = categoryList;
        this.client = client;
        this.userSurveysList = userSurveysList;
        this.isPublished = isPublished;
        this.urlGraficoSuperset = urlGraficoSuperset;
    }



}