import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Alert, ActivityIndicator } from 'react-native';
import { Question, Survey, Category, Genere } from '../types/formsSurvey.types';
import { FormApiService } from '../services/api/service';
import { QuestionCard } from '../components/QuestionCard/QuestionCard';
import { SurveySidebar } from '../components/QuestionCard/SurveySidebar';
import styles, { colors } from './stylesGlobal';
import { useLayout } from '@/app/utils/useLayout';
import { ResponsiveLayout } from '../components/ResponsiveLayout';
import { useAuth } from './Auth/AuthContext';

const SurveyCreatorScreen = ({ navigation }: any) => {
  const { isDesktopView } = useLayout();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableGeneres, setAvailableGeneres] = useState<Genere[]>([]);

  const [survey, setSurvey] = useState<Survey>({
    name: '',
    numUsers: 0,
    numQuestions: 0,
    questionList: [],
    categoryList: [], 
    genereList: [],   
    launchDate: new Date().toISOString(),
    closeDate: ''
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, gens] = await Promise.all([
          FormApiService.getCategories(),
          FormApiService.getGeneres()
        ]);
        setAvailableCategories(cats);
        setAvailableGeneres(gens);
      } catch (error) {
        console.error("Error cargando metadatos:", error);
      } finally {
        setLoadingMetadata(false);
      }
    };
    loadMetadata();
  }, []);

  // --- MANEJO DE PREGUNTAS (CORREGIDO) ---
  const addQuestion = () => {
    const newQuestion: Question = {
      textQuestion: '',
      // Ajustamos a la estructura de la base de datos
      config: {
        typeName: 'SHORT_TEXT',
        isMultiple: false,
        attributes: ''
      },
      option: [] 
    } as any; // Cast temporal si aún no has actualizado la interfaz .types

    setSurvey({
      ...survey,
      questionList: [...survey.questionList, newQuestion]
    });
  };

  const removeQuestion = (index: number) => {
    const updated = [...survey.questionList];
    updated.splice(index, 1);
    setSurvey({ ...survey, questionList: updated });
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...survey.questionList];
    updated[index].textQuestion = text;
    setSurvey({ ...survey, questionList: updated });
  };

  // --- ACTUALIZACIÓN DE TIPO (CORREGIDO PARA QUESTION_CONFIG) ---
  const updateType = (index: number, type: any) => {
    const updated = [...survey.questionList];
    
    // Guardamos los datos dentro del objeto config
    updated[index].config = {
      typeName: type,
      isMultiple: type === 'MULTIPLE_CHOICE',
      attributes: ''
    };

    // Mantenemos la lógica de inicializar opciones
    updated[index].option = (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') 
      ? [{ textOpcion: '' }] 
      : [];

    setSurvey({ ...survey, questionList: updated });
  };

  const addOption = (qIndex: number) => {
    const updated = [...survey.questionList];
    if (!updated[qIndex].option) {
      updated[qIndex].option = [];
    }
    updated[qIndex].option!.push({ textOpcion: '' });
    setSurvey({ ...survey, questionList: updated });
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...survey.questionList];
    if (updated[qIndex].option) {
      updated[qIndex].option![oIndex].textOpcion = text;
      setSurvey({ ...survey, questionList: updated });
    }
  };

  const handleSaveSurvey = async () => {
    if (!survey.name.trim() || survey.questionList.length === 0) {
      Alert.alert("Error", "Completa el título y añade al menos una pregunta.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "Sesión no válida.");
      return;
    }

    setLoading(true);
    try {
      // Enviamos el objeto survey que ya tiene la estructura con 'config'
      await FormApiService.submitForm(survey, user.id);
      Alert.alert("Éxito", "Encuesta publicada correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingMetadata) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <ResponsiveLayout fullWidth={true}>
      <View style={{ width: '100%', marginBottom: 30 }}>
        <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop, { textAlign: 'left', fontSize: 32 }]}>
          Nuevo <Text style={styles.destaqueAzul}>Proyecto</Text>
        </Text>
      </View>

      <View style={{ flexDirection: isDesktopView ? 'row' : 'column', width: '100%', gap: 30 }}>
        <View style={{ flex: 3 }}>
          <View style={[styles.margen2, { borderBottomWidth: 2, borderColor: colors.primary, marginBottom: 25 }]}>
            <TextInput 
              placeholder="Título de la Encuesta..." 
              placeholderTextColor="#666"
              style={[styles.mainText, { textAlign: 'left', fontSize: 24, paddingVertical: 10, color: 'white' }]}
              value={survey.name}
              onChangeText={(text) => setSurvey({ ...survey, name: text })}
            />
          </View>

          <FlatList
            data={survey.questionList}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <QuestionCard 
                // Pasamos el tipo extraído de config para que el componente visual funcione
                question={{
                  ...item,
                  typeName: item.config?.typeName || 'SHORT_TEXT' 
                } as any}
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
        </View>

        <View style={{ flex: 1, minWidth: 280 }}>
          <SurveySidebar 
            survey={survey}
            setSurvey={setSurvey}
            availableCategories={availableCategories}
            availableGeneres={availableGeneres}
          />
        </View>
      </View>
    </ResponsiveLayout>
  );
};

export default SurveyCreatorScreen;