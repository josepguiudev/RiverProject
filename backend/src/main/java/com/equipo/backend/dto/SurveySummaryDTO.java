package com.equipo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveySummaryDTO {
    private Long id; // Cambiado de idUserSurvey a id para coincidir con UserSurveyRel
    private int isRespondida; // Cambiado de boolean a int (0 o 1) para coincidir con tu TS
    private SurveySimpleDTO survey; // Objeto anidado para que funcione el e.survey.name

    @Data
    @AllArgsConstructor
    public static class SurveySimpleDTO {
        private Long id;
        private String name;
    }
}