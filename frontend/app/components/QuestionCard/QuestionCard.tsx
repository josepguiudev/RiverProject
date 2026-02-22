import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Question, QuestionOption } from '../../types/formsSurvey.types';

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdateQuestion: (text: string) => void;
  onUpdateType: (type: 'SHORT_TEXT' | 'NUMERIC' | 'SINGLE_CHOICE') => void;
  onAddOption: () => void;
  onUpdateOption: (text: string, oIndex: number) => void;
  onRemoveQuestion: () => void;
}

export const QuestionCard = ({
  question,
  index,
  onUpdateQuestion,
  onUpdateType,
  onAddOption,
  onUpdateOption,
  onRemoveQuestion
}: QuestionCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>Pregunta {index + 1}</Text>
        <TouchableOpacity onPress={onRemoveQuestion}>
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Escribe tu pregunta aquí..."
        value={question.text_question}
        onChangeText={onUpdateQuestion}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Tipo de respuesta:</Text>
      <View style={styles.typeRow}>
        {(['SHORT_TEXT', 'NUMERIC', 'SINGLE_CHOICE'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => onUpdateType(type)}
            style={[styles.typeBtn, question.type_name === type && styles.activeBtn]}
          >
            <Text style={[styles.btnText, question.type_name === type && styles.activeBtnText]}>
              {type === 'SHORT_TEXT' ? 'Texto' : type === 'NUMERIC' ? 'Número' : 'Opciones'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {question.type_name === 'SINGLE_CHOICE' && (
        <View style={styles.optionsBox}>
          {question.options?.map((opt, oIndex) => (
            <View key={oIndex} style={styles.optionRow}>
              <Ionicons name="radio-button-off" size={16} color="#2196F3" />
              <TextInput
                placeholder={`Opción ${oIndex + 1}`}
                value={opt.text_opcion}
                onChangeText={(text) => onUpdateOption(text, oIndex)}
                style={styles.optionInput}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addOptionBtn} onPress={onAddOption}>
            <Ionicons name="add-circle-outline" size={18} color="#2196F3" />
            <Text style={styles.addOptionText}>Añadir opción</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  questionNumber: { fontSize: 12, fontWeight: 'bold', color: '#999', textTransform: 'uppercase' },
  input: { fontSize: 16, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8, color: '#333' },
  label: { fontSize: 12, color: '#666', marginTop: 15, marginBottom: 8 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#eee' },
  activeBtn: { backgroundColor: '#E3F2FD', borderColor: '#2196F3' },
  btnText: { fontSize: 12, color: '#666' },
  activeBtnText: { color: '#2196F3', fontWeight: 'bold' },
  optionsBox: { marginTop: 15, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#E3F2FD' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  optionInput: { flex: 1, fontSize: 14, paddingVertical: 4, color: '#444' },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  addOptionText: { color: '#2196F3', fontSize: 13, fontWeight: '600' }
});