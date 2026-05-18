package com.equipo.backend.dto;

import java.util.List;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Para ignorar campos no recibidos de la API. Lo he aplicado por si devuelve
                                                              // el campo de "playtime_2weeks" vacío, puesto que solo devuelve si ha jugado 
                                                              // en estas ultimas dos semanas y no siempre es asi.

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SteamApiResponse {
    private ResponseData response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ResponseData {
        private int game_count;
        private List<SteamGame> games;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SteamGame {
        private Long appid;
        private String name;
        private String img_icon_url;
        private int playtime_forever;
        private int playtime_2weeks;
        private int playtime_windows_forever;
        private int playtime_mac_forever;
        private int playtime_linux_forever;
    }
}
