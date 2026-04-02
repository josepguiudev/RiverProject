import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
  onAddOption: () => void;
  onUpdateOption: (text: string, oIndex: number) => void;
}

export const MultipleChoiceQuestion = ({ question, onAddOption, onUpdateOption }: Props) => (
  <View style={styles.container}>
    {question.options?.map((opt, i) => (
      <View key={i} style={styles.optionRow}>
        <View style={styles.checkboxSquare} /> 
        <TextInput
          style={styles.optionInput}
          placeholder={`Opción múltiple ${i + 1}...`}
          placeholderTextColor="#555"
          value={opt.textOpcion}
          onChangeText={(text) => onUpdateOption(text, i)}
        />
      </View>
    ))}
    
    <TouchableOpacity style={styles.addOptionBtn} onPress={onAddOption}>
      <Text style={styles.addOptionText}>+ Añadir opción múltiple</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  checkboxSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#5b55c0',
    marginRight: 10
  },
  optionInput: { 
    flex: 1,
    borderBottomWidth: 1, 
    borderColor: '#444', 
    color: '#FFFFFF', 
    fontSize: 16,
    paddingVertical: 5
  },
  addOptionBtn: {
    paddingVertical: 10,
    marginTop: 5,
  },
  addOptionText: {
    color: '#5b55c0',
    fontWeight: '600',
    fontSize: 14
  }
});