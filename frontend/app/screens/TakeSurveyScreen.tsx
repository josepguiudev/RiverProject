import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { FormApiService } from '../services/api/service';
import { EncuestaRespuestaDTO } from '../types/formsSurvey.types';
import { useAuth } from '../screens/Auth/AuthContext'; // Asegúrate de que esta ruta es correcta

const TakeSurveyScreen = ({ route, navigation }: any) => {
  const { surveyId } = route.params;
  const { user } = useAuth(); // Obtenemos el ID real del usuario logueado
  
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [respuestasUser, setRespuestasUser] = useState<Record<number, any>>({});

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        // Carga la encuesta y las respuestas que el usuario ya tenía guardadas
        const data = await FormApiService.getPartialResponse(surveyId, user.id);
        if (data) {
          setSurvey(data);
          const savedMap: Record<number, any> = {};
          
          // Mapeamos lo que viene de Java (EncuestaParcialDTO)
          data.preguntas?.forEach((p: any) => {
            if (p.idOpcionSeleccionada) {
              savedMap[p.idPregunta] = p.idOpcionSeleccionada;
            } else if (p.valorRespuesta) {
              savedMap[p.idPregunta] = p.valorRespuesta;
            }
          });
          setRespuestasUser(savedMap);
        }
      } catch (e) {
        console.error("Error cargando preguntas:", e);
        Alert.alert("Error", "No s'ha pogut carregar l'enquesta.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [surveyId, user?.id]);

  const handleSelect = (qId: number, oId: number, isMultiple: boolean) => {
    setRespuestasUser(prev => {
      const current = prev[qId];
      if (isMultiple) {
        const list = Array.isArray(current) ? current : [];
        return { ...prev, [qId]: list.includes(oId) ? list.filter(id => id !== oId) : [...list, oId] };
      }
      return { ...prev, [qId]: oId };
    });
  };

  const handleSave = async (isFinal: boolean) => {
    if (!user?.id) return;

    const payload: EncuestaRespuestaDTO = {
      idEncuesta: surveyId,
      idUser: user.id,
      respuestas: Object.entries(respuestasUser).map(([qId, val]) => ({
        idPregunta: parseInt(qId),
        idOpcion: typeof val === 'number' ? val : undefined,
        valor: typeof val === 'string' ? val : "",
        isRespondida: true
      }))
    };

    try {
      await FormApiService.saveAnswers(payload, isFinal);
      Alert.alert("Èxit", isFinal ? "Enquesta finalitzada!" : "Progrés guardat");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "No s'ha pogut guardar.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#673ab7" style={{flex: 1}} />;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerCard}>
          <View style={styles.accentBar} />
          <Text style={styles.titleText}>{survey?.nombreEncuesta || "Enquesta"}</Text>
          <Text style={styles.subtitleText}>El teu progrés es guarda automàticament.</Text>
        </View>

        {survey?.preguntas?.map((pregunta: any) => {
          const opciones = pregunta.opcionesDisponibles || [];
          const hasOptions = opciones.length > 0;

          return (
            <View key={pregunta.idPregunta} style={styles.questionCard}>
              <Text style={styles.questionTitle}>{pregunta.textoPregunta}</Text>
              
              {hasOptions ? (
                opciones.map((opcio: any) => {
                  const resValue = respuestasUser[pregunta.idPregunta];
                  const selected = Number(resValue) === Number(opcio.idOpcion);
                  
                  return (
                    <TouchableOpacity 
                      key={opcio.idOpcion} 
                      style={styles.optionRow}
                      onPress={() => handleSelect(pregunta.idPregunta, opcio.idOpcion, false)}
                    >
                      <View style={[styles.radioOuter, selected && styles.selectedBorder]}>
                        {selected && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.optionLabel, selected && styles.selectedLabel]}>
                        {opcio.textoOpcion}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <TextInput
                  style={styles.textInput}
                  placeholder="Escriu aquí..."
                  value={String(respuestasUser[pregunta.idPregunta] || "")}
                  onChangeText={(text) => setRespuestasUser(prev => ({ ...prev, [pregunta.idPregunta]: text }))}
                  multiline
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={{color: '#673ab7'}}>Enrere</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSave} onPress={() => handleSave(true)}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Finalitzar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ebf8', padding: 12 },
  headerCard: { backgroundColor: 'white', borderRadius: 8, marginBottom: 15, overflow: 'hidden' },
  accentBar: { height: 8, backgroundColor: '#673ab7' },
  titleText: { fontSize: 22, padding: 15, fontWeight: 'bold' },
  subtitleText: { paddingHorizontal: 15, paddingBottom: 15, color: '#666' },
  questionCard: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 12 },
  questionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  radioOuter: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#dadce0', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#673ab7' },
  selectedBorder: { borderColor: '#673ab7' },
  selectedLabel: { color: '#673ab7', fontWeight: 'bold' },
  optionLabel: { fontSize: 15 },
  textInput: { borderBottomWidth: 1, borderColor: '#673ab7', padding: 5, minHeight: 40 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', flexDirection: 'row', padding: 15, justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee' },
  btnBack: { padding: 15, width: '45%', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#673ab7' },
  btnSave: { padding: 15, width: '45%', alignItems: 'center', borderRadius: 5, backgroundColor: '#673ab7' }
});

export default TakeSurveyScreen;