package com.equipo.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GameSteamRequest {
    @JsonProperty("appid")
    private Long appid;

    @JsonProperty("name")
    private String name;

    @JsonProperty("img_icon_url")
    private String img_icon_url;

    public Long getAppid() {
        return this.appid;
    }
    public void setAppid(Long appid) {
        this.appid = appid;
    }

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getImg_icon_url() {
        return this.img_icon_url;
    }
    public void setImg_icon_url(String img_icon_url) {
        this.img_icon_url = img_icon_url;
    }
}
