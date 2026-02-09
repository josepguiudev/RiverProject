package com.equipo.backend.model;

import java.util.ArrayList;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Game {
       @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Boolean isEarlyAcces;
    private ArrayList<String> generes;
    @nullable private ArrayList<String> logros;

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
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

    public ArrayList<String> getGeneres() {
        return this.generes;
    }
    public void setGeneres(ArrayList<String> generes) {
        this.generes = generes;
    }

    public ArrayList<String> getLogros() {
        return this.logros;
    }
    public void setLogros(ArrayList<String> logros) {
        this.logros = logros;
    }

}
