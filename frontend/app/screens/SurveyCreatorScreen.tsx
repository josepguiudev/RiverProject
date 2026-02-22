import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Question, QuestionOption, Survey } from '../types/formsSurvey.types';
import { surveyService } from '../services/api/service';

const SurveyCreatorScreen = () => {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // 1. Añadir una nueva pregunta base
  const addQuestion = () => {
    const newQuestion: Question = {
      text_question: '',
      type_name: 'SHORT_TEXT',
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  // 2. Añadir una opción a una pregunta específica (solo para SINGLE_CHOICE)
  const addOptionToQuestion = (qIndex: number) => {
    const updatedQuestions = [...questions];
    const newOption: QuestionOption = { text_opcion: '' };
    
    if (!updatedQuestions[qIndex].options) {
        updatedQuestions[qIndex].options = [];
    }
    
    updatedQuestions[qIndex].options?.push(newOption);
    setQuestions(updatedQuestions);
  };

  // 3. Actualizar el texto de una opción
  const updateOptionText = (text: string, qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].options) {
      updatedQuestions[qIndex].options![oIndex].text_opcion = text;
      setQuestions(updatedQuestions);
    }
  };

  const saveFullSurvey = async () => {
    const finalSurvey: Survey = {
      name: surveyName,
      numQuestions: questions.length,
      questionList: questions
    };
    await surveyService.createTemplate(finalSurvey);
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Nombre de la encuesta" 
        onChangeText={setSurveyName} 
        style={styles.mainInput} 
      />

      <FlatList
        data={questions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index: qIndex }) => (
          <View style={styles.questionCard}>
            <TextInput
              placeholder="Escribe la pregunta..."
              onChangeText={(text) => {
                const updated = [...questions];
                updated[qIndex].text_question = text;
                setQuestions(updated);
              }}
              style={styles.input}
            />
            
            {/* Selector de Tipo (Simplificado para el ejemplo) */}
            <View style={styles.row}>
                {['SHORT_TEXT', 'NUMERIC', 'SINGLE_CHOICE'].map((type) => (
                    <TouchableOpacity 
                        key={type}
                        onPress={() => {
                            const updated = [...questions];
                            updated[qIndex].type_name = type as any;
                            setQuestions(updated);
                        }}
                        style={[styles.typeBtn, item.type_name === type && styles.activeBtn]}
                    >
                        <Text style={styles.btnText}>{type.split('_')[0]}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Renderizar opciones solo si es SINGLE_CHOICE */}
            {item.type_name === 'SINGLE_CHOICE' && (
              <View style={styles.optionsContainer}>
                {item.options?.map((opt, oIndex) => (
                  <TextInput
                    key={oIndex}
                    placeholder={`Opción ${oIndex + 1}`}
                    onChangeText={(text) => updateOptionText(text, qIndex, oIndex)}
                    style={styles.optionInput}
                  />
                ))}
                <TouchableOpacity onPress={() => addOptionToQuestion(qIndex)}>
                  <Text style={styles.addOptionText}>+ Añadir Opción</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={addQuestion}>
        <Text style={styles.saveBtnText}>Nueva Pregunta</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.saveBtn, {backgroundColor: '#4CAF50'}]} onPress={saveFullSurvey}>
        <Text style={styles.saveBtnText}>Guardar Todo en River DB</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  mainInput: { fontSize: 20, fontWeight: 'bold', borderBottomWidth: 2, marginBottom: 20 },
  questionCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  input: { borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  typeBtn: { padding: 8, borderRadius: 5, backgroundColor: '#eee' },
  activeBtn: { backgroundColor: '#2196F3' },
  btnText: { fontSize: 10, color: '#333' },
  optionsContainer: { marginTop: 10, paddingLeft: 20, borderLeftWidth: 2, borderLeftColor: '#2196F3' },
  optionInput: { fontSize: 14, color: '#666', marginBottom: 5 },
  addOptionText: { color: '#2196F3', fontWeight: 'bold', marginTop: 5 },
  saveBtn: { padding: 15, borderRadius: 10, backgroundColor: '#2196F3', alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: 'white', fontWeight: 'bold' }
});

export default SurveyCreatorScreen;