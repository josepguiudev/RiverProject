package com.equipo.backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;

import lombok.Data;

@Entity
@Table(name = "user_steam")
@Data

public class UserSteam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String steamid;
    @nullable private Long communityvisibilitystate;
    @nullable private Long profilestate;
    @nullable private String personaname;
    @nullable private String profileurl;
    @nullable private String avatar;
    @nullable private String avatarmedium;
    @nullable private String avatarfull;
    @nullable private String avatarhash;
    @nullable private Long lastlogoff;
    @nullable private Long personastate;
    @nullable private String realname;
    @nullable private String primaryclanid;
    @nullable private Long timecreated;
    @nullable private Long personastateflags;

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getIdSteam() {
        return this.steamid;
    }
    public void setIdSteam(String steamid) {
        this.steamid = steamid;
    }

    public Long getCommunityVisibilityState() {
        return this.communityvisibilitystate;
    }
    public void setCommunityVisibilityState(Long communityvisibilitystate) {
        this.communityvisibilitystate = communityvisibilitystate;
    }

    public Long getProfileState() {
        return this.profilestate;
    }
    public void setProfileState(Long profilestate) {
        this.profilestate = profilestate;
    }

    public String getPersonaName() {
        return this.personaname;
    }
    public void setPersonaName(String personaname) {
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

    @Override
    public String toString(){
        return "User Steam [id=" + id + "]";
    }
}