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
    private Long appid;                                                                                                                                                                                               

    private String title;
    private byte isEarlyAcces;
    private String iconUrl;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "game_generes",                                  // Tabla intermedia
        joinColumns = @JoinColumn(name = "id_game"),            // FK a la tabla Game
        inverseJoinColumns = @JoinColumn(name = "id_genere")    // FK a la tabla Genere
    )
    private List<Genere> genereList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<Logro> logros = new ArrayList<>();

    @ManyToMany(mappedBy = "games")
    private List<UserSteam> userSteamList = new ArrayList<>();


    public Long getId_game() {
    return this.id_game; 
    }
    public void setId_game(Long id_game) {
        this.id_game = id_game;
    }

    public Long getAppid() {
        return this.appid;
    }
    public void setAppid(Long appid) {
        this.appid = appid;
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

    public String getIconUrl() {
        return this.iconUrl;
    }
    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
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

    public List<UserSteam> getUserSteamList() {
        return this.userSteamList;
    }

    public void setUserSteamList(List<UserSteam> userSteamList) {
        this.userSteamList = userSteamList;
    }


}
