package com.equipo.backend.dto;

public class GameSteamFrontDTO {
    private Long id_game;
    private Long appid;
    private String title;
    private String iconUrl;

    // Constructor vacío
    public GameSteamFrontDTO() {}

    // Constructor con todos los campos
    public GameSteamFrontDTO(Long id_game, Long appid, String title, String iconUrl) {
        this.id_game = id_game;
        this.appid = appid;
        this.title = title;
        this.iconUrl = iconUrl;
    }

    // Getters y Setters
    public Long getId_game() {
        return id_game;
    }

    public void setId_game(Long id_game) {
        this.id_game = id_game;
    }

    public Long getAppid() {
        return appid;
    }

    public void setAppid(Long appid) {
        this.appid = appid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
