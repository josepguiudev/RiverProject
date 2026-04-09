import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import { Question, Survey } from '../types/formsSurvey.types';
import { FormApiService } from '../services/api/service';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';

import styles, { colors } from './stylesGlobal';
import { useLayout } from '@/app/utils/useLayout';
import { ResponsiveLayout } from '../components/ResponsiveLayout';
import { useAuth } from './Auth/AuthContext'; // <--- IMPORTANTE: Importa tu AuthContext

const SurveyCreatorScreen = ({ navigation }: any) => {
  const { isDesktopView } = useLayout();
  const { user } = useAuth(); // <--- OBTENER EL CLIENTE LOGUEADO
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE MANEJO DE PREGUNTAS ---
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      textQuestion: '', 
      typeName: 'SHORT_TEXT', 
      options: [] 
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].textQuestion = text;
    setQuestions(updated);
  };

  const updateType = (index: number, type: Question['typeName']) => {
    const updated = [...questions];
    updated[index].typeName = type; 
    
    if (type === 'SHORT_TEXT' || type === 'NUMERIC') {
      updated[index].options = []; 
    } else if (!updated[index].options || updated[index].options.length === 0) {
      updated[index].options = [{ id: Date.now(), textOpcion: '' }];
    }
    setQuestions(updated);
  };
  
  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push({ id: Date.now(), textOpcion: '' });
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![oIndex].textOpcion = text;
      setQuestions(updated);
    }
  };

  // --- GUARDADO FINAL ---
  const handleSaveSurvey = async () => {
    if (!surveyName.trim() || questions.length === 0) {
      Alert.alert("Error", "Completa el título y añade al menos una pregunta.");
      return;
    }

    // Verificación de seguridad
    if (!user || !user.id) {
      Alert.alert("Sesión expirada", "No se encontró el ID del cliente. Reintenta el login.");
      return;
    }

    setLoading(true);
    try {
      const finalSurvey: Survey = {
        name: surveyName,
        numQuestions: questions.length,
        numUsers: 0,
        questionList: questions.map((q) => ({
          textQuestion: q.textQuestion,
          typeName: q.typeName,
          option: q.options?.map((o) => ({
            textOpcion: o.textOpcion
          })) || []
        })),
        SurveyReward: 0,
        genereList: [] 
      };

      // Enviamos la encuesta y el ID del cliente al servicio
      await FormApiService.submitForm(finalSurvey, user.id);
      
      Alert.alert("Éxito", "Encuesta publicada correctamente.");
      navigation.goBack(); // Volver al listado de encuestas del cliente
      
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout fullWidth={true}>
        <View style={{ width: '100%', marginBottom: 30 }}>
            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop, { textAlign: 'left', fontSize: 32 }]}>
                Nuevo <Text style={styles.destaqueAzul}>Proyecto</Text>
            </Text>
            
            <View style={[styles.margen2, { borderBottomWidth: 2, borderColor: colors.primary }]}>
                <TextInput 
                    placeholder="Título de la Encuesta..." 
                    placeholderTextColor="#666"
                    style={[styles.mainText, { textAlign: 'left', fontSize: 24, paddingVertical: 10, color: 'white' }]}
                    value={surveyName}
                    onChangeText={setSurveyName}
                />
            </View>
        </View>

        <FlatList
          data={questions}
          keyExtractor={(item) => item.id!.toString()}
          scrollEnabled={false}
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
            <TouchableOpacity 
                style={[styles.btnSecondary, { width: '100%', borderStyle: 'dashed', marginTop: 10, borderWidth: 1, borderColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' }]} 
                onPress={addQuestion}
            >
                <Text style={{ color: colors.secondary, fontWeight: 'bold' }}>+ AÑADIR PREGUNTA</Text>
            </TouchableOpacity>
          }
          style={{ width: '100%' }}
        />

        <View style={{ width: '100%', marginTop: 40, paddingBottom: 50 }}>
          <TouchableOpacity 
            style={[styles.btnPrimary, { width: '100%' }, loading && { opacity: 0.5 }]} 
            onPress={handleSaveSurvey}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.btnPrimaryText}>PUBLICAR ENCUESTA</Text>}
          </TouchableOpacity>
        </View>
    </ResponsiveLayout>
  );
};

export default SurveyCreatorScreen;