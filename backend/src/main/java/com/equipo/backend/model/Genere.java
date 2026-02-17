package com.equipo.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "genere")
public class Genere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_genere;

    private String nombreGenero;

    @ManyToOne
    @JoinColumn(name = "id_game") 
    private Game game;

    @ManyToOne
    @JoinColumn(name = "id_survey")
    private Survey survey;


    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Long getId_genere() {
        return this.id_genere;
    }

    public void setId_genere(Long id_genere) {
        this.id_genere = id_genere;
    }

    public String getNombreGenero() {
        return this.nombreGenero;
    }

    public void setNombreGenero(String nombreGenero) {
        this.nombreGenero = nombreGenero;
    }


}
