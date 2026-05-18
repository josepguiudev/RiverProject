package com.equipo.backend.dto;

/**
 * DTO simple para devolver al frontend el nombre del género
 * y su porcentaje de aparición en la biblioteca del usuario.
 */
public class GenrePercentageDTO {

    private String name;
    private int percentage;

    public GenrePercentageDTO() {
    }

    public GenrePercentageDTO(String name, int percentage) {
        this.name = name;
        this.percentage = percentage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
}
