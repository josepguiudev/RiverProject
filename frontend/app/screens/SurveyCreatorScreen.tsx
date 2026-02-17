import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Survey, Question, QuestionType, Option } from '../types/formsSurvey.types';

export default function SurveyBuilder() {
  const [survey, setSurvey] = useState<Survey>({
    tempId: Date.now().toString(),
    nombre: '',
    numQuestions: 0,
    questions: [],
    generes: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // -------- Agregar Pregunta --------
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: '',
      tempId: Date.now().toString(),
      type,
      questionText: '',
      options:
        type !== 'shortAnswer' && type !== 'longAnswer'
          ? [{ id: Date.now().toString(), text: '' }]
          : [],
    };
    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
      numQuestions: survey.questions.length + 1,
    });
  };

  // -------- Validar Survey --------
  const validateSurvey = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!survey.nombre.trim()) newErrors['surveyTitle'] = 'Survey must have a title';
    survey.questions.forEach((q) => {
      if (!q.questionText.trim()) newErrors[q.tempId] = 'Question text is required';
      if (
        (q.type === 'multipleChoice' || q.type === 'checkbox' || q.type === 'dropdown') &&
        (!q.options || q.options.length === 0 || q.options.some((o) => !o.text.trim()))
      ) {
        newErrors[q.tempId] = 'All options must have text';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------- Actualizar Pregunta --------
  const updateQuestion = (tempId: string, updated: Partial<Question>) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.tempId === tempId ? { ...q, ...updated } : q
      ),
    });
  };

  // -------- Agregar/Actualizar/Eliminar Opción --------
  const addOption = (tempId: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.tempId === tempId
          ? {
              ...q,
              options: [...(q.options || []), { id: Date.now().toString(), text: '' }],
            }
          : q
      ),
    });
  };

  const updateOption = (qId: string, optionId: string, text: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.tempId === qId
          ? { ...q, options: q.options?.map((o) => (o.id === optionId ? { ...o, text } : o)) }
          : q
      ),
    });
  };

  const removeOption = (qId: string, optionId: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.tempId === qId ? { ...q, options: q.options?.filter((o) => o.id !== optionId) } : q
      ),
    });
  };

  // -------- Enviar Survey --------
  const submitSurvey = async () => {
    if (!validateSurvey()) {
      Alert.alert('Error', 'Please fix validation errors');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/formSurvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey),
      });
      if (!res.ok) throw new Error('Failed to save survey');
      const data = await res.json();
      Alert.alert('Success', 'Survey saved successfully!');
      setSurvey({
        tempId: Date.now().toString(),
        nombre: '',
        numQuestions: 0,
        questions: [],
        generes: [],
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save survey');
    }
  };

  // -------- Render Pregunta --------
  const renderQuestion = ({ item, drag, isActive }: RenderItemParams<Question>) => {
    return (
      <TouchableOpacity
        style={[styles.questionCard, { backgroundColor: isActive ? '#f0f0f0' : '#fff' }]}
        onLongPress={drag}
      >
        <Text style={styles.questionLabel}>
          {item.type.toUpperCase()} QUESTION
        </Text>

        <TextInput
          style={styles.questionText}
          placeholder="Enter question text"
          value={item.questionText}
          onChangeText={(text) => updateQuestion(item.tempId, { questionText: text })}
        />
        {errors[item.tempId] && <Text style={styles.errorText}>{errors[item.tempId]}</Text>}

        {item.options && (
          <View style={{ marginTop: 8 }}>
            {item.options.map((o) => (
              <View key={o.id} style={styles.optionRow}>
                <TextInput
                  style={styles.optionInput}
                  placeholder="Option text"
                  value={o.text}
                  onChangeText={(text) => updateOption(item.tempId, o.id, text)}
                />
                <TouchableOpacity onPress={() => removeOption(item.tempId, o.id)}>
                  <Text style={styles.deleteOption}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addOptionBtn} onPress={() => addOption(item.tempId)}>
              <Text style={styles.addButtonText}>+ Add Option</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Survey</Text>

      <TextInput
        style={styles.input}
        placeholder="Survey Title"
        value={survey.nombre}
        onChangeText={(text) => setSurvey({ ...survey, nombre: text })}
      />
      {errors['surveyTitle'] && <Text style={styles.errorText}>{errors['surveyTitle']}</Text>}

      <View style={styles.questionTypeContainer}>
        {(['shortAnswer', 'longAnswer', 'multipleChoice', 'checkbox', 'dropdown'] as QuestionType[]).map(
          (type) => (
            <TouchableOpacity key={type} style={styles.addButton} onPress={() => addQuestion(type)}>
              <Text style={styles.addButtonText}>{type}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <DraggableFlatList
        data={survey.questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.tempId}
        onDragEnd={({ data }) => setSurvey({ ...survey, questions: data })}
        style={{ marginVertical: 16 }}
      />

      <Button title="Submit Survey" onPress={submitSurvey} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  input: { borderBottomWidth: 1, marginBottom: 12, fontSize: 18, paddingVertical: 6 },
  errorText: { color: 'red', marginBottom: 6 },
  questionTypeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  questionCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionLabel: { fontWeight: '700', marginBottom: 8, color: '#444' },
  questionText: { fontSize: 16, borderBottomWidth: 1, paddingVertical: 6 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  optionInput: { flex: 1, borderBottomWidth: 1, paddingVertical: 4, marginRight: 8 },
  deleteOption: { color: '#ff4d4d', fontWeight: 'bold', fontSize: 16 },
  addOptionBtn: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
});
