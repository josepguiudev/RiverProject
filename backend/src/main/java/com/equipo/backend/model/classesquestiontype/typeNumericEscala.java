package com.equipo.backend.model.classesquestiontype;

public class typeNumericEscala extends QuestionType {

    private int maxValue;
    private int minValue;
    private int responsValue;

    public int getMaxValue() {
        return this.maxValue;
    }
    public void setMaxValue(int maxValue) {
        this.maxValue = maxValue;
    }

    public int getMinValue() {
        return this.minValue;
    }
    public void setMinValue(int minValue) {
        this.minValue = minValue;
    }

    public int getResponsValue() {
        return this.responsValue;
    }
    public void setResponsValue(int responsValue) {
        this.responsValue = responsValue;
    }

}
