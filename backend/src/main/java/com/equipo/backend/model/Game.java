package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "game")
@Data
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_game;

    private String title;
    private byte isEarlyAcces;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @nullable private List<Genere> genereList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @nullable private List<Logro> logros;




    public Long getId_game() {
        return this.id_game;
    }

    public void setId_game(Long id_game) {
        this.id_game = id_game;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public byte isIsEarlyAcces() {
        return this.isEarlyAcces;
    }

    public byte getIsEarlyAcces() {
        return this.isEarlyAcces;
    }

    public void setIsEarlyAcces(byte isEarlyAcces) {
        this.isEarlyAcces = isEarlyAcces;
    }

    public List<Genere> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(List<Genere> genereList) {
        this.genereList = genereList;
    }


    public List<Logro> getLogros() {
        return this.logros;
    }

    public void setLogros(List<Logro> logros) {
        this.logros = logros;
    }

    public Game(){}

    public Game(Long id_game, String title, byte isEarlyAcces, List<Genere> genereList, List<Logro> logros) {
        this.id_game = id_game;
        this.title = title;
        this.isEarlyAcces = isEarlyAcces;
        this.genereList = genereList;
        this.logros = logros;
    }


}
