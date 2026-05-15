package com.equipo.backend.model;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "game")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
        name = "game_generes",                                  
        joinColumns = @JoinColumn(name = "id_game"),            
        inverseJoinColumns = @JoinColumn(name = "id_genere")    
    )
    @JsonIgnoreProperties("games") // Rompe ciclo de géneros
    private List<Genere> genereList = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "game_category",
        joinColumns = @JoinColumn(name = "id_game"),
        inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    @ToString.Exclude
    @JsonIgnoreProperties("games") // 🛠️ CORRECCIÓN: Rompe ciclo de categorías
    private List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnoreProperties("game") // Rompe ciclo de logros
    private List<Logro> logrosList = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnoreProperties("game") // Rompe ciclo de usuarios
    private List<UserGame> userGames = new ArrayList<>();
}