package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;


@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id_game"
)
@Table(name = "game")
@Data
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_game;
    private Long appid;                                                                                                                                                                                               
    private int id_game_steam;
    private String title;
    private int price;
    private byte isEarlyAcces;
    private String iconUrl;
    private String url_image;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "game_generes",                                  // Tabla intermedia
        joinColumns = @JoinColumn(name = "id_game"),            // FK a la tabla Game
        inverseJoinColumns = @JoinColumn(name = "id_genere")    // FK a la tabla Genere
    )
    private List<Genere> genereList = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "game_category",
        joinColumns = @JoinColumn(name = "id_game"),
        inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    @ToString.Exclude
    @nullable private List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @ToString.Exclude
    @nullable private List<Logro> logrosList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<UserGame> userGames = new ArrayList<>();



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

    public int getPrice() {
        return this.price;
    }

    public void setPrice(int price) {
        this.price = price;
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

    public String getUrl_image() {
        return this.url_image;
    }

    public void setUrl_image(String url_image) {
        this.url_image = url_image;
    }


    public List<Genere> getGeneresList() {
        return this.genereList;
    }

    public void setGeneresList(List<Genere> generesList) {
        this.genereList = generesList;
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


    public int getId_game_steam() {
        return this.id_game_steam;
    }

    public void setId_game_steam(int id_game_steam) {
        this.id_game_steam = id_game_steam;
    }

    public List<Genere> getGenereList() {
        return this.genereList;
    }

    public void setGenereList(List<Genere> genereList) {
        this.genereList = genereList;
    }

    public List<Logro> getLogrosList() {
        return this.logrosList;
    }

    public void setLogrosList(List<Logro> logrosList) {
        this.logrosList = logrosList;
    }


    public Game() {
    }

    public Game(Long id_game, Long appid, int id_game_steam, String title, int price, byte isEarlyAcces, String iconUrl, String url_image, List<Genere> genereList, List<Category> categoryList, List<Logro> logrosList, List<UserGame> userGames) {
        this.id_game = id_game;
        this.appid = appid;
        this.id_game_steam = id_game_steam;
        this.title = title;
        this.price = price;
        this.isEarlyAcces = isEarlyAcces;
        this.iconUrl = iconUrl;
        this.url_image = url_image;
        this.genereList = genereList;
        this.categoryList = categoryList;
        this.logrosList = logrosList;
        this.userGames = userGames;
    }

}
