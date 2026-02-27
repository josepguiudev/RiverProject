package com.equipo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSteamRequest {
    @JsonProperty("steamid")
    private String steamid;

    @JsonProperty("communityvisibilitystate")
    private Long communityvisibilitystate;

    @JsonProperty("profilestate")
    private Long profilestate;

    @JsonProperty("personaname")
    private String personaname;

    @JsonProperty("profileurl")
    private String profileurl;

    @JsonProperty("avatar")
    private String avatar;

    @JsonProperty("avatarmedium")
    private String avatarmedium;

    @JsonProperty("avatarfull")
    private String avatarfull;

    @JsonProperty("avatarhash")
    private String avatarhash;

    @JsonProperty("lastlogoff")
    private Long lastlogoff;

    @JsonProperty("personastate")
    private Long personastate;

    @JsonProperty("realname")
    private String realname;

    @JsonProperty("primaryclanid")
    private String primaryclanid;

    @JsonProperty("timecreated")
    private Long timecreated;

    @JsonProperty("personastateflags")
    private Long personastateflags;

    public String getSteamid() {
        return this.steamid;
    }
    public void setSteamid(String steamid) {
        this.steamid = steamid;
    }

    public Long getCommunityvisibilitystate() {
        return this.communityvisibilitystate;
    }
    public void setCommunityvisibilitystate(Long communityvisibilitystate) {
        this.communityvisibilitystate = communityvisibilitystate;
    }

    public Long getProfilestate() {
        return this.profilestate;
    }
    public void setProfilestate(Long profilestate) {
        this.profilestate = profilestate;
    }

    public String getPersonaname() {
        return this.personaname;
    }
    public void setPersonaname(String personaname) {
        this.personaname = personaname;
    }

    public String getProfileUrl() {
        return this.profileurl;
    }
    public void setProfileUrl(String profileurl) {
        this.profileurl = profileurl;
    }

    public String getAvatar() {
        return this.avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAvatarMedium() {
        return this.avatarmedium;
    }
    public void setAvatarMedium(String avatarmedium) {
        this.avatarmedium = avatarmedium;
    }

    public String getAvatarFull() {
        return this.avatarfull;
    }
    public void setAvatarFull(String avatarfull) {
        this.avatarfull = avatarfull;
    }

    public String getAvatarHash() {
        return this.avatarhash;
    }
    public void setAvatarHash(String avatarhash) {
        this.avatarhash = avatarhash;
    }

    public Long getLastLogOff() {
        return this.lastlogoff;
    }
    public void setLastLogOff(Long lastlogoff) {
        this.lastlogoff = lastlogoff;
    }

    public Long getPersonaState() {
        return this.personastate;
    }
    public void setPersonaState(Long personastate) {
        this.personastate = personastate;
    }

    public String getRealName() {
        return this.realname;
    }
    public void setRealName(String realname) {
        this.realname = realname;
    }

    public String getPrimaryClanId() {
        return this.primaryclanid;
    }
    public void setPrimaryClanId(String primaryclanid) {
        this.primaryclanid = primaryclanid;
    }

    public Long getTimeCreated() {
        return this.timecreated;
    }
    public void setTimeCreated(Long timecreated) {
        this.timecreated = timecreated;
    }

    public Long getPersonaStateFlags() {
        return this.personastateflags;
    }
    public void setPersonaStateFlags(Long personastateflags) {
        this.personastateflags = personastateflags;
    }
}
