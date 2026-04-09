package com.equipo.backend.service;

import com.equipo.backend.dto.UserSteamRequest;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.repository.UserSteamRepository;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class UserSteamService {
    private final UserSteamRepository userSteamRepository;
    public UserSteamService(UserSteamRepository userSteamRepository){
        this.userSteamRepository = userSteamRepository;
    }

    public void register(UserSteamRequest request) {

        if (userSteamRepository.findBySteamid(request.getSteamid()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        UserSteam userSteam = new UserSteam();
        userSteam.setSteamId(request.getSteamid());
        userSteam.setCommunityVisibilityState(request.getCommunityvisibilitystate());
        userSteam.setProfileState(request.getProfilestate());
        userSteam.setPersonaName(request.getPersonaname());
        userSteam.setProfileUrl(request.getProfileUrl());
        userSteam.setAvatar(request.getAvatar());
        userSteam.setAvatarMedium(request.getAvatarMedium());
        userSteam.setAvatarFull(request.getAvatarFull());
        userSteam.setAvatarHash(request.getAvatarHash());
        userSteam.setLastLogOff(request.getLastLogOff());
        userSteam.setPersonaState(request.getPersonaState());
        userSteam.setRealName(request.getRealName());
        userSteam.setPrimaryClanId(request.getPrimaryClanId());
        userSteam.setTimeCreated(request.getTimeCreated());
        userSteam.setPersonaStateFlags(request.getPersonaStateFlags());

        userSteamRepository.save(userSteam);
    }

    @Transactional
    public void registerAll(List<UserSteamRequest> requests) {
        for (UserSteamRequest request : requests) {
            if (userSteamRepository.findBySteamid(request.getSteamid()).isEmpty()) {
                UserSteam userSteam = new UserSteam();
                userSteam.setSteamId(request.getSteamid());
                userSteam.setCommunityVisibilityState(request.getCommunityvisibilitystate());
                userSteam.setProfileState(request.getProfilestate());
                userSteam.setPersonaName(request.getPersonaname());
                userSteam.setProfileUrl(request.getProfileUrl());
                userSteam.setAvatar(request.getAvatar());
                userSteam.setAvatarMedium(request.getAvatarMedium());
                userSteam.setAvatarFull(request.getAvatarFull());
                userSteam.setAvatarHash(request.getAvatarHash());
                userSteam.setLastLogOff(request.getLastLogOff());
                userSteam.setPersonaState(request.getPersonaState());
                userSteam.setRealName(request.getRealName());
                userSteam.setPrimaryClanId(request.getPrimaryClanId());
                userSteam.setTimeCreated(request.getTimeCreated());
                userSteam.setPersonaStateFlags(request.getPersonaStateFlags());

                userSteamRepository.save(userSteam); 
            }
        }
    }

    public List<UserSteam> getAll() {
        return userSteamRepository.findAll();
    }

    public UserSteam getById(Long id) {
        return userSteamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UserSteam update(Long id, UserSteam updatedUser) {
        UserSteam user = userSteamRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setPersonaName(updatedUser.getPersonaName());
        user.setAvatar(updatedUser.getAvatar());
        user.setProfileUrl(updatedUser.getProfileUrl());

        return userSteamRepository.save(user);
    }

    public void delete(Long id) {
        userSteamRepository.deleteById(id);
    }

    public UserSteam getBySteamId(String steamid) {
    return userSteamRepository.findBySteamid(steamid)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado con steamid"));
}

}
