import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { QuestionCard } from './QuestionCard';
import { Survey, Question } from '../../types/formsSurvey.types';

export const SurveyEditor = () => {
  // Inicializamos la encuesta siguiendo tu interfaz Survey
  const [survey, setSurvey] = useState<Survey>({
    name: '',
    numUsers: 0,
    numQuestions: 0,
    questionList: [] // Aquí es donde Jackson espera las preguntas
  });

  // 1. Agregar Pregunta (Sin ID, el backend lo genera)
  const addQuestion = () => {
    const newQuestion: Question = {
      textQuestion: '',
      typeName: 'SHORT_TEXT',
      option: [] // Usamos 'option' según tu interfaz para Jackson
    };
    
    setSurvey(prev => ({
      ...prev,
      questionList: [...prev.questionList, newQuestion],
      numQuestions: prev.questionList.length + 1
    }));
  };

  // 2. Actualizar Tipo de Pregunta
  const updateType = (qIndex: number, newType: Question['typeName']) => {
    setSurvey(prev => {
      const newList = [...prev.questionList];
      newList[qIndex] = {
        ...newList[qIndex],
        typeName: newType,
        // Si es de opciones, aseguramos que el array 'option' exista
        option: (newType === 'SINGLE_CHOICE' || newType === 'MULTIPLE_CHOICE') 
                ? (newList[qIndex].option ?? [{ textOpcion: '' }])
                : []
      };
      return { ...prev, questionList: newList };
    });
  };

  // 3. Manejo de Opciones (Campo 'option')
  const addOption = (qIndex: number) => {
    setSurvey(prev => {
      const newList = [...prev.questionList];
      const currentOptions = newList[qIndex].option ?? [];
      newList[qIndex] = {
        ...newList[qIndex],
        option: [...currentOptions, { textOpcion: '' }]
      };
      return { ...prev, questionList: newList };
    });
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    setSurvey(prev => {
      const newList = [...prev.questionList];
      if (newList[qIndex].option) {
        const newOptions = [...newList[qIndex].option!];
        newOptions[oIndex] = { ...newOptions[oIndex], textOpcion: text };
        newList[qIndex].option = newOptions;
      }
      return { ...prev, questionList: newList };
    });
  };

  return (
    <ScrollView style={{ backgroundColor: '#000' }} contentContainerStyle={{ padding: 20 }}>
      {survey.questionList.map((q, index) => (
        <QuestionCard
          key={index} // Usamos index porque el ID no existe hasta que el server responda
          question={q}
          index={index}
          onUpdateQuestion={(text) => {
            const newList = [...survey.questionList];
            newList[index].textQuestion = text;
            setSurvey({ ...survey, questionList: newList });
          }}
          onRemoveQuestion={() => {
            const newList = survey.questionList.filter((_, i) => i !== index);
            setSurvey({ ...survey, questionList: newList, numQuestions: newList.length });
          }}
          onUpdateType={(type) => updateType(index, type)}
          onAddOption={() => addOption(index)}
          onUpdateOption={(text, oIndex) => updateOptionText(index, oIndex, text)}
        />
      ))}

      <TouchableOpacity style={styles.btnAdd} onPress={addQuestion}>
        <Text style={styles.btnText}>+ AÑADIR PREGUNTA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btnAdd: { backgroundColor: '#5b55c0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold' }
});