package com.equipo.backend.service;

import com.equipo.backend.dto.UserSteamRequest;
import com.equipo.backend.model.UserSteam;
import com.equipo.backend.repository.UserSteamRepository;
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
        userSteam.setIdSteam(request.getSteamid());
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
