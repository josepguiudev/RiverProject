package com.equipo.backend.model.classesquestiontype;

import java.util.ArrayList;

public class typeSingleOption extends QuestionType {

    private ArrayList<String> listOptions;
    private String selectedOption;

    public ArrayList<String> getListOptions() {
        return this.listOptions;
    }

    public void setListOptions(ArrayList<String> listOptions) {
        this.listOptions = listOptions;
    }
    public String getSelectedOption() {
        return this.selectedOption;
    }
    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
