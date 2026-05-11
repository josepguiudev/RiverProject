package com.equipo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveySummaryDTO {
    private Long id;
    private int isRespondida;
    private SurveySimpleDTO survey;

    @Data
    @AllArgsConstructor
    public static class SurveySimpleDTO {
        private Long id;
        private String name;
        private Integer numQuestions;
        private String supersetID;
    }
}