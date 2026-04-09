package com.equipo.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

// Para crear una API que haga request de los datos básicos de la encuestas para mostrar en frontend/app/components/Cards/ListEncuestas.tsx

// Record sirve para reducir código, inmutabilidad por defecto, encapsulamiento de datos y proporciona seguridad al no tener setters.
public record SurveyRequest(
        Long id,
        String name,
        LocalDateTime creationDate,
        LocalDateTime launchDate,
        LocalDate closeDate,
        Integer numQuestions,
        Integer pago) {

}
