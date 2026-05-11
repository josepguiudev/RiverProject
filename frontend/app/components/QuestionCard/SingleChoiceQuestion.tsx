import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
  onAddOption: () => void;
  onUpdateOption: (text: string, index: number) => void;
}

export const SingleChoiceQuestion = ({ question, onAddOption, onUpdateOption }: Props) => (
  <View style={styles.container}>
    {question.option?.map((opt, i) => (
      <View key={i} style={styles.optionRow}>
        <View style={styles.radioDot} /> 
        <TextInput
          style={styles.optionInput}
          placeholder={`Opción ${i + 1}...`}
          placeholderTextColor="#555"
          value={opt.textOpcion}
          onChangeText={(text) => onUpdateOption(text, i)}
        />
      </View>
    ))}
    
    <TouchableOpacity style={styles.addOptionBtn} onPress={onAddOption}>
      <Text style={styles.addOptionText}>+ Añadir opción única</Text>
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
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2196F3',
    marginRight: 10
  },
  optionInput: { 
    flex: 1,
    borderBottomWidth: 1, 
    borderColor: '#444', 
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  addOptionBtn: {
    paddingVertical: 10,
    marginTop: 5,
  },
  addOptionText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14
  }
});