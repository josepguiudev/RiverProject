package com.equipo.backend.dto;

import java.util.List;

public class UserSteamFrontDTO {
     private Long id;
    private String personaName;
    private String steamId;
    private String avatar;
    private String profileUrl;
    private List<GameSteamFrontDTO> games;

    // Constructor vacío
    public UserSteamFrontDTO() {}

    // Constructor con todos los campos
    public UserSteamFrontDTO(Long id, String personaName, String steamId, String avatar, String profileUrl, List<GameSteamFrontDTO> games) {
        this.id = id;
        this.personaName = personaName;
        this.steamId = steamId;
        this.avatar = avatar;
        this.profileUrl = profileUrl;
        this.games = games;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPersonaName() {
        return personaName;
    }

    public void setPersonaName(String personaName) {
        this.personaName = personaName;
    }

    public String getSteamId() {
        return steamId;
    }

    public void setSteamId(String steamId) {
        this.steamId = steamId;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getProfileUrl() {
        return profileUrl;
    }

    public void setProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public List<GameSteamFrontDTO> getGames() {
        return games;
    }

    public void setGames(List<GameSteamFrontDTO> games) {
        this.games = games;
    }
}
