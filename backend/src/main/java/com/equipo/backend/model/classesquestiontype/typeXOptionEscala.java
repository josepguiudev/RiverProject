package com.equipo.backend.model.classesquestiontype;

import java.util.ArrayList;

public class typeXOptionEscala extends QuestionType {

    private int numEscalas;
    private ArrayList<Integer> listOptions;
    private int selectedOption;

    public int getNumEscalas() {
        return numEscalas;
    }
    public void setNumEscalas(int numEscalas) {
        this.numEscalas = numEscalas;
    }

    public ArrayList<Integer> getListOptions() {
        return listOptions;
    }
    public void setListOptions(ArrayList<Integer> listOptions) {
        this.listOptions = listOptions;
    }
    
    public int getSelectedOption() {
        return selectedOption;
    }
    public void setSelectedOption(int selectedOption) {
        this.selectedOption = selectedOption;
    }


}
