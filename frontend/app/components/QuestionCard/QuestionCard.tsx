import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Question, QuestionOption } from '../../types/formsSurvey.types';
import { ShortTextQuestion } from './ShortTextQuestion';
import { NumericQuestion } from './NumericQuestion';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';

interface Props {
  question: Question;
  index: number;
  onUpdateQuestion: (text: string) => void;
  onRemoveQuestion: () => void;
  onUpdateType: (type: Question['type_name']) => void;
  onAddOption?: () => void;
  onUpdateOption?: (text: string, oIndex: number) => void;
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
    switch (question.type_name) {
      case 'SHORT_TEXT':
        return <ShortTextQuestion question={question} onUpdateQuestion={onUpdateQuestion} />;
      case 'NUMERIC':
        return <NumericQuestion question={question} onUpdateQuestion={onUpdateQuestion} />;
      case 'SINGLE_CHOICE':
        return (
          <SingleChoiceQuestion 
            question={question} 
            onUpdateQuestion={onUpdateQuestion} 
            onAddOption={onAddOption!} 
            onUpdateOption={onUpdateOption!} 
          />
        );
      case 'MULTIPLE_CHOICE':
        return (
          <MultipleChoiceQuestion 
            question={question} 
            onUpdateQuestion={onUpdateQuestion} 
            onAddOption={onAddOption!} 
            onUpdateOption={onUpdateOption!} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Pregunta {index + 1}</Text>
        <TouchableOpacity onPress={onRemoveQuestion}>
          <Text style={styles.remove}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        placeholder="Escribe la pregunta..." 
        style={styles.input} 
        value={question.text_question} 
        onChangeText={onUpdateQuestion}
      />

      {renderQuestionByType()}

      <View style={styles.typeButtons}>
        {['SHORT_TEXT','NUMERIC','SINGLE_CHOICE','MULTIPLE_CHOICE'].map(type => (
          <TouchableOpacity key={type} onPress={() => onUpdateType(type as Question['type_name'])} style={styles.typeBtn}>
            <Text style={styles.typeBtnText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 15, borderRadius: 10, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontWeight: 'bold', fontSize: 14 },
  remove: { color: '#F44336', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  typeButtons: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  typeBtn: { marginRight: 10, marginBottom: 5, backgroundColor: '#2196F3', padding: 5, borderRadius: 5 },
  typeBtnText: { color: 'white', fontSize: 12 }
});