package com.equipo.backend.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "bono_total")
@Data
public class BonoTotal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int cantidadTotal;

    @OneToOne(mappedBy = "bonoTotal")
    @JoinColumn(name = "id_user") 
    private User user;


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getCantidadTotal() {
        return this.cantidadTotal;
    }

    public void setCantidadTotal(int cantidadTotal) {
        this.cantidadTotal = cantidadTotal;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BonoTotal() {
    }


    public BonoTotal(Long id, int cantidadTotal, User user) {
        this.id = id;
        this.cantidadTotal = cantidadTotal;
        this.user = user;
    }


}
