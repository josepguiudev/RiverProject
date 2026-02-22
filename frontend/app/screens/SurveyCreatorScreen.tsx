import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Text, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Question, Survey } from '../types/formsSurvey.types';
import { FormApiService } from '../services/api/service';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';

const SurveyCreatorScreen = () => {
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE PREGUNTAS ---

  const addQuestion = () => {
    setQuestions([...questions, { 
      text_question: '', 
      type_name: 'SHORT_TEXT', 
      options: [] 
    }]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text_question = text;
    setQuestions(updated);
  };

  const updateType = (index: number, type: 'SHORT_TEXT' | 'NUMERIC' | 'SINGLE_CHOICE') => {
    const updated = [...questions];
    updated[index].type_name = type;
    
    // Si el tipo es SINGLE_CHOICE, inicializar con una opción vacía si no tiene
    if (type === 'SINGLE_CHOICE' && (!updated[index].options || updated[index].options.length === 0)) {
      updated[index].options = [{ text_opcion: '' }];
    }
    setQuestions(updated);
  };

  // --- LÓGICA DE OPCIONES ---

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push({ text_opcion: '' });
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![oIndex].text_opcion = text;
      setQuestions(updated);
    }
  };

  // --- ENVÍO AL BACKEND ---

  const handleSaveSurvey = async () => {
    // Validaciones básicas
    if (!surveyName.trim()) {
      Alert.alert("Error", "El nombre de la encuesta es obligatorio");
      return;
    }
    if (questions.length === 0) {
      Alert.alert("Error", "Debes añadir al menos una pregunta");
      return;
    }

    setLoading(true);
    try {
      const finalSurvey: Survey = {
        name: surveyName,
        numQuestions: questions.length,
        questionList: questions
      };

      await FormApiService.submitForm(finalSurvey);
      
      Alert.alert("Éxito", "Encuesta guardada correctamente en River DB");
      
      // Opcional: Limpiar el formulario tras éxito
      setSurveyName('');
      setQuestions([]);
      
    } catch (error) {
      Alert.alert("Error de conexión", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View style={styles.headerSection}>
              <Text style={styles.labelHeader}>Título de la Encuesta</Text>
              <TextInput 
                placeholder="Ej: Encuesta de Satisfacción 2026" 
                style={styles.mainTitleInput}
                value={surveyName}
                onChangeText={setSurveyName}
              />
            </View>
          }
          data={questions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <QuestionCard 
              question={item}
              index={index}
              onUpdateQuestion={(text) => updateQuestionText(index, text)}
              onRemoveQuestion={() => removeQuestion(index)}
              onUpdateType={(type) => updateType(index, type)}
              onAddOption={() => addOption(index)}
              onUpdateOption={(text, oIndex) => updateOptionText(index, oIndex, text)}
            />
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
               <Text style={styles.addBtnText}>+ Añadir Nueva Pregunta</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay preguntas aún. Presiona el botón de abajo.</Text>
            </View>
          }
        />

        {/* Botón Flotante de Guardar */}
        <View style={styles.footerAction}>
          <TouchableOpacity 
            style={[styles.saveBtn, loading && styles.disabledBtn]} 
            onPress={handleSaveSurvey}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveText}>Guardar en River DB</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerSection: { marginBottom: 25 },
  labelHeader: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase' },
  mainTitleInput: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    borderBottomWidth: 3, 
    borderColor: '#2196F3', 
    paddingVertical: 5 
  },
  addBtn: { 
    padding: 20, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderColor: '#2196F3', 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  addBtnText: { color: '#2196F3', fontWeight: 'bold', fontSize: 16 },
  footerAction: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 20, 
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  saveBtn: { 
    backgroundColor: '#4CAF50', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  disabledBtn: { backgroundColor: '#A5D6A7' },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', textAlign: 'center', fontSize: 14 }
});

export default SurveyCreatorScreen;