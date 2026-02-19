package com.equipo.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "logro")
public class Logro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_logro;
    
    private String textLogro;

    @ManyToOne
    @JoinColumn(name = "id_game")
    private Game game;


    public Long getId_logro() {
        return this.id_logro;
    }

    public void setId_logro(Long id_logro) {
        this.id_logro = id_logro;
    }

    public String getTextLogro() {
        return this.textLogro;
    }

    public void setTextLogro(String textLogro) {
        this.textLogro = textLogro;
    }

    public Game getGame() {
        return this.game;
    }

    public void setGame(Game game) {
        this.game = game;
    }



}
