import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Survey, Question, Option, QuestionType } from '../types/formsSurvey.types';
import { FormApiService } from '../services/api/service';

const SurveyCreatorScreen = () => {
  // 1. Estat inicial segons la teva interfície Survey
  const [survey, setSurvey] = useState<Survey>({
    nombre: "",
    numQuestions: 0,
    tempId: Math.random().toString(36).substr(2, 9),
    questions: [],
    generes: []
  });

  // 2. Funció per afegir una nova pregunta (estil Google Forms)
  const addQuestion = () => {
    const newQuestion: Question = {
      tempId: Math.random().toString(36).substr(2, 9),
      type: "multipleChoice", // Tipus per defecte
      questionText: "",
      options: [{ id: "1", text: "Opció 1" }]
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      numQuestions: prev.questions.length + 1
    }));
  };

  // 3. Funció per afegir una opció a una pregunta específica
  const addOption = (qTempId: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.tempId === qTempId) {
          const newOption: Option = {
            id: (q.options!.length + 1).toString(),
            text: `Opció ${q.options!.length + 1}`
          };
          return { ...q, options: [...(q.options || []), newOption] };
        }
        return q;
      })
    }));
  };

  // 4. Funció per enviar al Backend usant el teu FormApiService
  const handleSave = async () => {
  console.log("------- DADES QUE S'ENVIARAN -------");
  console.log(JSON.stringify(survey, null, 2)); // Això imprimeix el JSON bonic a la terminal

  try {
    const result = await FormApiService.submitForm(survey);
    console.log("✅ RESPOSTA DEL SERVIDOR:", result);
  } catch (error: any) {
    console.log("❌ ERROR EN LA PETICIÓ:");
    // Això és clau per veure si és un error 400, 500 o de xarxa
    console.error(error); 
  }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Targeta de Títol */}
      <View style={styles.headerCard}>
        <View style={styles.topBar} />
        <TextInput
          style={styles.titleInput}
          placeholder="Títol del formulari"
          value={survey.nombre}
          onChangeText={(text) => setSurvey({ ...survey, nombre: text })}
        />
      </View>

      {/* Llista de preguntes dinàmiques */}
      {survey.questions.map((q, index) => (
        <View key={q.tempId} style={styles.questionCard}>
          <TextInput
            style={styles.questionInput}
            placeholder="Pregunta"
            value={q.questionText}
            onChangeText={(text) => {
              const newQuestions = [...survey.questions];
              newQuestions[index].questionText = text;
              setSurvey({ ...survey, questions: newQuestions });
            }}
          />

          {/* Render de les opcions (si és multipleChoice o checkbox) */}
          {(q.type === 'multipleChoice' || q.type === 'checkbox') && (
            <View style={styles.optionsArea}>
              {q.options?.map((opt, optIndex) => (
                <View key={opt.id} style={styles.optionRow}>
                  <View style={styles.radioCircle} />
                  <TextInput
                    style={styles.optionInput}
                    value={opt.text}
                    onChangeText={(text) => {
                      const newQuestions = [...survey.questions];
                      newQuestions[index].options![optIndex].text = text;
                      setSurvey({ ...survey, questions: newQuestions });
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity onPress={() => addOption(q.tempId)}>
                <Text style={styles.addOptionText}>+ Afegeix opció</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Botons d'acció */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
          <Text style={styles.buttonText}>Afegir Pregunta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.addButton, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar a la BD</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ebf8', padding: 12 },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  topBar: { height: 10, backgroundColor: '#673ab7' },
  titleInput: { fontSize: 24, padding: 20, fontWeight: 'bold' },
  questionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  questionInput: {
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#70757a',
    marginRight: 10,
  },
  optionInput: { fontSize: 14, flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee' },
  addOptionText: { color: '#4285f4', fontWeight: 'bold', marginTop: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  addButton: {
    backgroundColor: '#673ab7',
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  saveButton: { backgroundColor: '#0f9d58' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  optionsArea: { marginTop: 10 }
});

export default SurveyCreatorScreen;