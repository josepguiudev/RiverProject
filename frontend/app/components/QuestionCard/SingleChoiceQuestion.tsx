import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
  onUpdateQuestion: (text: string) => void;
  onAddOption: () => void;
  onUpdateOption: (text: string, oIndex: number) => void;
}

export const SingleChoiceQuestion = ({ question, onUpdateQuestion, onAddOption, onUpdateOption }: Props) => (
  <View style={{ marginTop: 10 }}>
    {question.options?.map((opt, i) => (
      <TextInput
        key={i}
        style={styles.optionInput}
        placeholder={`Opción ${i + 1}`}
        value={opt.text_opcion}
        onChangeText={(text) => onUpdateOption(text, i)}
      />
    ))}
    <TouchableOpacity onPress={onAddOption} style={styles.addOption}>
      <Text style={{ color: '#2196F3' }}>+ Añadir opción</Text>
    </TouchableOpacity>
  </View>
);

export const MultipleChoiceQuestion = SingleChoiceQuestion; // Misma lógica que single choice

const styles = StyleSheet.create({
  optionInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 5 },
  addOption: { marginTop: 5 }
});