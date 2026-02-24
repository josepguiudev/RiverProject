package com.equipo.backend.model;


import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

import lombok.Data;


@Entity
@Table(name = "survey")
@Data

public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_survey;

    private int numQuestions;
    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime  creationDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime  launchDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @Column(nullable = true) private LocalDateTime closeDate;
    
    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Question> questionList = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago", nullable = true)
    private Pago pago = null;

    @OneToOne(cascade = CascadeType.ALL) //solo para pruebas borrar cascade luego
    @JoinColumn(name = "id_pago_panelista", nullable = true)
    private PagoPanelista pagoPanelista;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL)
    private List<Genere> genereList = new ArrayList<>();

    public void setCreationDate(LocalDateTime timestamp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreationDate'");
    }

    public void setCreationDate(Timestamp timestamp) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCreationDate'");
    }

}