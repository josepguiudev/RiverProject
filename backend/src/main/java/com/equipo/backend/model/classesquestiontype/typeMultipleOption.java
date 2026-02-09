package com.equipo.backend.model.classesquestiontype;

import java.util.ArrayList;

public class typeMultipleOption extends QuestionType {

    private ArrayList<String> listOptions;
    private ArrayList<String> selectOptions;

    public ArrayList<String> getListOptions() {
        return listOptions;
    }
    public void setListOptions(ArrayList<String> listOptions) {
        this.listOptions = listOptions;
    }
    
    public ArrayList<String> getSelectOptions() {
        return selectOptions;
    }
    public void setSelectOptions(ArrayList<String> selectOptions) {
        this.selectOptions = selectOptions;
    }
}
