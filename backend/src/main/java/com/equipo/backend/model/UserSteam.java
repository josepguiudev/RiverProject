package com.equipo.backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import jakarta.persistence.FetchType;

@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
@Table(name = "user_steam")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserSteam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "userSteam")
    //@JsonBackReference  //lado “hijo” que será ignorado durante la serialización
    private User user;

    private String steamid;
    private Long communityvisibilitystate;
    private Long profilestate;
    private String personaname;
    private String profileurl;
    private String avatar;
    private String avatarmedium;
    private String avatarfull;
    private String avatarhash;
    private Long lastlogoff;
    private Long personastate;
    private String realname;
    private String primaryclanid;
    private Long timecreated;
    private Long personastateflags;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_steam_games",                          // Nombre de la tabla intermedia en la BD
        joinColumns = @JoinColumn(name = "user_steam_id"),  // FK que apunta a UserSteam
        inverseJoinColumns = @JoinColumn(name = "id_game")  // FK que apunta a Game
    )

    //@JsonManagedReference //lado “padre” que quieres serializar normalmente.
    private List<Game> games = new ArrayList<>();

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getSteamId() {
        return this.steamid;
    }
    public void setSteamId(String steamid) {
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

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Game> getGames() {
        return this.games;
    }

    public void setGames(List<Game> games) {
        this.games = games;
    }

    @Override
    public String toString(){
        return "User Steam [id=" + id + "]";
    }
}