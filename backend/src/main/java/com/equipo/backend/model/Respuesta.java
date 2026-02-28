package com.equipo.backend.model;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "respuesta")
@Data
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "id_option")
    private Option option;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    private String valueRespuesta;

    @OneToOne(mappedBy = "respuesta", cascade = CascadeType.ALL)
    private OpcionRespuesta opcionRespuesta;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Option getOption() {
        return this.option;
    }

    public void setOption(Option option) {
        this.option = option;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getValueRespuesta() {
        return this.valueRespuesta;
    }

    public void setValueRespuesta(String valueRespuesta) {
        this.valueRespuesta = valueRespuesta;
    }


    public Respuesta() {
    }

    public Respuesta(Long id, Option option, User user, String valueRespuesta) {
        this.id = id;
        this.option = option;
        this.user = user;
        this.valueRespuesta = valueRespuesta;
    }


}
