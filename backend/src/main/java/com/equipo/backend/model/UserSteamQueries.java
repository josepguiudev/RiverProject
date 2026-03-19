package com.equipo.backend.model;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Table(name = "user_steam_queries")
@Data

public class UserSteamQueries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String query;
    private int type;
    private String description;

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getQuery() {
        return this.query;
    }
    public void setQuery(String query) {
        this.query = query;
    }

    public int getType() {
        return this.type;
    }
    public void setType(int type) {
        this.type = type;
    }

    public String getDescription() {
        return this.description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

}