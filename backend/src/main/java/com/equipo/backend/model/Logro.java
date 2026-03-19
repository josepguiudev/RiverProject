package com.equipo.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "logro")
@Data
public class Logro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String textLogro;

    @ManyToOne
    @JoinColumn(name = "id_game")
    private Game game;

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

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public Logro() {
    }


    public Logro(Long id, String textLogro, Game game) {
        this.id = id;
        this.textLogro = textLogro;
        this.game = game;
    }

}
