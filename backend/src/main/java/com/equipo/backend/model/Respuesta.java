package com.equipo.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "respuesta")
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_respuesta;

    @OneToOne
    @JoinColumn(name = "id_option")
    private Option option;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    private String valueRespuesta;




    public Long getId_respuesta() {
        return this.id_respuesta;
    }

    public void setId_respuesta(Long id_respuesta) {
        this.id_respuesta = id_respuesta;
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


}
