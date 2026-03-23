import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import { Question, Survey, QuestionOption } from '../types/formsSurvey.types';
import { FormApiService } from '../services/api/service';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';

import styles, { colors } from './stylesGlobal';
import { useLayout } from '@/app/utils/useLayout';
import { ResponsiveLayout } from '../components/ResponsiveLayout';

const SurveyCreatorScreen = () => {
  const { isDesktopView } = useLayout();
  const [surveyName, setSurveyName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    // Usamos los nombres exactos de tu interfaz Question
    const newQuestion: Question = {
      id: Date.now(), // ID temporal para el mapeo
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
    updated[index].textQuestion = text; // CAMBIADO
    setQuestions(updated);
  };

  const updateType = (index: number, type: Question['typeName']) => {
    const updated = [...questions];
    updated[index].typeName = type; 
    
    // Si NO es de opciones, limpiamos el array para que no aparezcan inputs extra
    if (type === 'SHORT_TEXT' || type === 'NUMERIC') {
      updated[index].options = []; 
    } 
    // Si es de opciones y está vacío, añadimos la primera
    else if (!updated[index].options || updated[index].options.length === 0) {
      updated[index].options = [{ id: Date.now(), textOpcion: '' }];
    }
    
    setQuestions(updated);
  };
  
  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push({ id: Date.now(), textOpcion: '' }); // CAMBIADO
    setQuestions(updated);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![oIndex].textOpcion = text; // CAMBIADO
      setQuestions(updated);
    }
  };

const handleSaveSurvey = async () => {
  if (!surveyName.trim() || questions.length === 0) {
    Alert.alert("Error", "Completa el título y añade al menos una pregunta.");
    return;
  }
  setLoading(true);
  try {
    const finalSurvey: Survey = {
      name: surveyName,
      numQuestions: questions.length,
      numUsers: 0,
      // Mapeamos asegurando que incluimos todos los campos obligatorios
      questionList: questions.map((q) => ({
        textQuestion: q.textQuestion,
        typeName: q.typeName, // <--- AÑADE ESTO (Soluciona el error TS2322)
        option: q.options?.map((o) => ({
          textOpcion: o.textOpcion
        })) || []
      })),
      SurveyReward: 0,
      genereList: [] 
    };

    console.log("JSON que viaja al Backend:", JSON.stringify(finalSurvey, null, 2));

    await FormApiService.submitForm(finalSurvey);
    
    Alert.alert("Éxito", "Encuesta guardada correctamente.");
    setSurveyName('');
    setQuestions([]);
  } catch (error) {
    Alert.alert("Error", (error as Error).message);
  } finally {
    setLoading(false);
  }
};

  return (
    <ResponsiveLayout>
        <View style={{ width: '100%', marginBottom: 30 }}>
            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop, { textAlign: 'left', fontSize: 32 }]}>
                Nuevo <Text style={styles.destaqueAzul}>Proyecto</Text>
            </Text>
            
            <View style={[styles.margen2, { borderBottomWidth: 2, borderColor: colors.primary }]}>
                <TextInput 
                    placeholder="Título de la Encuesta..." 
                    placeholderTextColor="#666"
                    style={[styles.mainText, { textAlign: 'left', fontSize: 24, paddingVertical: 10 }]}
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
                style={[styles.btnSecondary, { width: '100%', borderStyle: 'dashed', marginTop: 10 }]} 
                onPress={addQuestion}
            >
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>+ AÑADIR PREGUNTA</Text>
            </TouchableOpacity>
          }
          style={{ width: '100%' }}
        />

        <View style={{ width: '100%', marginTop: 40 }}>
          <TouchableOpacity 
            style={[styles.btnPrimary, { width: '100%' }, loading && { opacity: 0.5 }]} 
            onPress={handleSaveSurvey}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#1D2735" /> : <Text style={styles.btnPrimaryText}>GUARDAR EN RIVER DB</Text>}
          </TouchableOpacity>
        </View>
    </ResponsiveLayout>
  );
};

export default SurveyCreatorScreen;