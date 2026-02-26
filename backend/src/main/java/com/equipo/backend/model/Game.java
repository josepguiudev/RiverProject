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
    private Long id;

    private int id_game_steam;
    private String title;
    private int price;
    private byte isEarlyAcces;
    private String url_image;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "game_genere",
        joinColumns = @JoinColumn(name = "id_game"),
        inverseJoinColumns = @JoinColumn(name = "id_genere")
    )
    private List<Genere> generesList = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "game_category",
        joinColumns = @JoinColumn(name = "id_game"),
        inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    @nullable private List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @nullable private List<Logro> logrosList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserGame> userGames = new ArrayList<>();


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getId_game_steam() {
        return this.id_game_steam;
    }

    public void setId_game_steam(int id_game_steam) {
        this.id_game_steam = id_game_steam;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPrice() {
        return this.price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public byte getIsEarlyAcces() {
        return this.isEarlyAcces;
    }

    public void setIsEarlyAcces(byte isEarlyAcces) {
        this.isEarlyAcces = isEarlyAcces;
    }

    public String getUrl_image() {
        return this.url_image;
    }

    public void setUrl_image(String url_image) {
        this.url_image = url_image;
    }


    public List<Genere> getGeneresList() {
        return this.generesList;
    }

    public void setGeneresList(List<Genere> generesList) {
        this.generesList = generesList;
    }

    public List<UserGame> getUserGames() {
        return this.userGames;
    }

    public void setUserGames(List<UserGame> userGames) {
        this.userGames = userGames;
    }
    
    public List<Category> getCategoryList() {
        return this.categoryList;
    }

    public void setCategoryList(List<Category> categoryList) {
        this.categoryList = categoryList;
    }

    public List<Logro> getLogrosList() {
        return this.logrosList;
    }

    public void setLogrosList(List<Logro> logrosList) {
        this.logrosList = logrosList;
    }



    public Game() {
    }



    public Game(Long id, int id_game_steam, String title, int price, byte isEarlyAcces, String url_image, List<Genere> genereList, List<Category> categoryList, List<Logro> logrosList) {
        this.id = id;
        this.id_game_steam = id_game_steam;
        this.title = title;
        this.price = price;
        this.isEarlyAcces = isEarlyAcces;
        this.url_image = url_image;
        this.generesList = genereList;
        this.categoryList = categoryList;
        this.logrosList = logrosList;
    }



   

}
