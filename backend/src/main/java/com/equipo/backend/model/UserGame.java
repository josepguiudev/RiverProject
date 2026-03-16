package com.equipo.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_game")
@Data

public class UserGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_game")
    private Game game;

    private float numHoursGame;


    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Game getGame() {
        return this.game;
    }
    public void setGame(Game game) {
        this.game = game;
    }

    public float getNumHoursGame() {
        return this.numHoursGame;
    }
    public void setNumHoursGame(float numHoursGame) {
        this.numHoursGame = numHoursGame;
    }


    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserGame() {
    }


    public UserGame(Long id, Game game, float numHoursGame) {
        this.id = id;
        this.game = game;
        this.numHoursGame = numHoursGame;
    }





}
