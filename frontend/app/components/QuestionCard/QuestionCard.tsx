import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';
import { ShortTextQuestion } from './ShortTextQuestion';
import { NumericQuestion } from './NumericQuestion';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';

interface Props {
  question: Question;
  index: number;
  onUpdateQuestion: (text: string) => void;
  onRemoveQuestion: () => void;
  onUpdateType: (type: Question['typeName']) => void;
  onAddOption: () => void;
  onUpdateOption: (text: string, oIndex: number) => void;
}

export const QuestionCard = ({
  question,
  index,
  onUpdateQuestion,
  onRemoveQuestion,
  onUpdateType,
  onAddOption,
  onUpdateOption
}: Props) => {

  const renderQuestionByType = () => {
    // IMPORTANTE: Aquí es donde ocurre la magia del cambio visual
    switch (question.typeName) {
      case 'SHORT_TEXT':
        return <ShortTextQuestion question={question} />;
      case 'NUMERIC':
        return <NumericQuestion question={question} />;
      case 'SINGLE_CHOICE':
        return (
          <SingleChoiceQuestion 
            question={question} 
            onAddOption={onAddOption} 
            onUpdateOption={onUpdateOption} 
          />
        );
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoiceQuestion 
            question={question} 
            onAddOption={onAddOption} 
            onUpdateOption={onUpdateOption} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>PREGUNTA {index + 1}</Text>
        <TouchableOpacity onPress={onRemoveQuestion}>
          <Text style={styles.remove}>ELIMINAR</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        placeholder="Escribe el enunciado..." 
        placeholderTextColor="#555"
        style={styles.input} 
        value={question.textQuestion} 
        onChangeText={onUpdateQuestion}
      />

      <View style={{ marginBottom: 15 }}>
        {renderQuestionByType()}
      </View>

      <Text style={styles.typeLabel}>TIPO DE RESPUESTA</Text>
      
      <View style={styles.typeButtons}>
        {['SHORT_TEXT', 'NUMERIC', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE'].map(type => (
          <TouchableOpacity 
            key={type} 
            onPress={() => onUpdateType(type as Question['typeName'])} 
            style={[styles.typeBtn, question.typeName === type && styles.typeBtnActive]}
          >
            <Text style={styles.typeBtnText}>{type.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#1a1a1a', marginBottom: 20, borderRadius: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontWeight: 'bold', color: '#64B5F6' },
  remove: { color: '#F44336', fontSize: 12 },
  input: { backgroundColor: '#0e0d0d', color: '#FFF', borderRadius: 8, padding: 12, marginBottom: 15 },
  typeLabel: { fontSize: 10, color: '#444', marginBottom: 8, fontWeight: 'bold' },
  typeButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { backgroundColor: '#222', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  typeBtnActive: { backgroundColor: '#5b55c0', borderColor: '#7c74ff' },
  typeBtnText: { color: 'white', fontSize: 9, fontWeight: '800' }
});