package com.equipo.backend.model;


import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "user_survey")
@Data
public class UserSurveys {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_survey")
    private Survey survey;

    private byte isRespondida;



    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public byte getIsRespondida() {
        return this.isRespondida;
    }

    public void setIsRespondida(byte isRespondida) {
        this.isRespondida = isRespondida;
    }


    public UserSurveys() {
    }


    public UserSurveys(Long id, User user, Survey survey, byte isRespondida) {
        this.id = id;
        this.user = user;
        this.survey = survey;
        this.isRespondida = isRespondida;
    }

}
