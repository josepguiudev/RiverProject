package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;


@Entity
@Table(name = "game")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_game;

    private String title;
    private Boolean isEarlyAcces;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @nullable private List<Genere> genereList;
    @nullable private ArrayList<String> logros;


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

    public Boolean isIsEarlyAcces() {
        return this.isEarlyAcces;
    }

    public Boolean getIsEarlyAcces() {
        return this.isEarlyAcces;
    }

    public void setIsEarlyAcces(Boolean isEarlyAcces) {
        this.isEarlyAcces = isEarlyAcces;
    }

    public List<Genere> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(List<Genere> genereList) {
        this.genereList = genereList;
    }

    public ArrayList<String> getLogros() {
        return this.logros;
    }

    public void setLogros(ArrayList<String> logros) {
        this.logros = logros;
    }

}
