import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
  onUpdateQuestion: (text: string) => void;
}

export const NumericQuestion = ({ question, onUpdateQuestion }: Props) => (
  <TextInput
    placeholder="Número..."
    style={styles.input}
    keyboardType="numeric"
    value={question.text_question}
    onChangeText={onUpdateQuestion}
  />
);

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 10 }
});