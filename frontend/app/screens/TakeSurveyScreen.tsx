import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { FormApiService } from '../services/api/service';
import { EncuestaRespuestaDTO } from '../types/formsSurvey.types';

const TakeSurveyScreen = ({ route, navigation }: any) => {
  const { surveyId } = route.params;
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [respuestasUser, setRespuestasUser] = useState<Record<number, any>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await FormApiService.getPartialResponse(surveyId, 1);
        if (data) {
          setSurvey(data);
          const savedMap: Record<number, any> = {};
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
        console.error("Error carregar:", e);
      } finally { setLoading(false); }
    };
    loadData();
  }, [surveyId]);

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
    const payload: EncuestaRespuestaDTO = {
      idEncuesta: surveyId,
      idUser: 1, // <--- Este es el que leerá el Service norrar despues
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

  if (loading) return <ActivityIndicator size="large" color="#673ab7" style={styles.loader} />;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerCard}>
          <View style={styles.accentBar} />
          <Text style={styles.titleText}>{survey?.nombreEncuesta || "Enquesta"}</Text>
          <Text style={styles.subtitleText}>El teu progrés es guarda automàticament.</Text>
        </View>

        {survey?.preguntas?.map((pregunta: any) => {
          // Lógica de detección: si no hay opciones, es TEXTO.
          const hasOptions = pregunta.opcionesDisponibles && pregunta.opcionesDisponibles.length > 0;
          const isMultiple = pregunta.typeName === 'MULTIPLE_CHOICE';

          return (
            <View key={pregunta.idPregunta} style={styles.questionCard}>
              <Text style={styles.questionTitle}>{pregunta.textoPregunta}</Text>
              
              {hasOptions ? (
                pregunta.opcionesDisponibles.map((opcio: any) => {
                  const resValue = respuestasUser[pregunta.idPregunta];
                  const selected = isMultiple 
                    ? Array.isArray(resValue) && resValue.includes(opcio.idOpcion)
                    : Number(resValue) === Number(opcio.idOpcion);
                  
                  return (
                    <TouchableOpacity 
                      key={opcio.idOpcion} 
                      style={styles.optionRow}
                      onPress={() => handleSelect(pregunta.idPregunta, opcio.idOpcion, isMultiple)}
                    >
                      <View style={[
                        styles.selectionOuter, 
                        isMultiple ? styles.checkBorder : styles.radioBorder,
                        selected && styles.selectedBorder
                      ]}>
                        {selected && <View style={isMultiple ? styles.checkInner : styles.radioInner} />}
                      </View>
                      <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>
                        {opcio.textoOpcion}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                // SI NO HAY OPCIONES -> RENDERIZAR INPUT DE TEXTO
                <TextInput
                  style={styles.textInput}
                  placeholder="Escriu la teva resposta aquí..."
                  placeholderTextColor="#999"
                  value={String(respuestasUser[pregunta.idPregunta] || "")}
                  onChangeText={(text) => setRespuestasUser(prev => ({ ...prev, [pregunta.idPregunta]: text }))}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* BOTONES FIJOS ABAJO */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelText}>Enrere</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => handleSave(true)}>
          <Text style={styles.btnSubmitText}>Finalitzar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ebf8', padding: 12 },
  loader: { flex: 1, justifyContent: 'center' },
  headerCard: { backgroundColor: 'white', borderRadius: 8, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  accentBar: { height: 10, backgroundColor: '#673ab7' },
  titleText: { fontSize: 24, padding: 20, paddingBottom: 5, fontWeight: 'bold' },
  subtitleText: { paddingHorizontal: 20, paddingBottom: 20, color: '#5f6368', fontSize: 13 },
  questionCard: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 12, elevation: 1 },
  questionTitle: { fontSize: 16, marginBottom: 15, color: '#202124', fontWeight: '600' },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  selectionOuter: { height: 20, width: 20, borderWidth: 2, borderColor: '#dadce0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  radioBorder: { borderRadius: 10 },
  checkBorder: { borderRadius: 4 },
  selectedBorder: { borderColor: '#673ab7' },
  radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#673ab7' },
  checkInner: { height: 12, width: 12, borderRadius: 2, backgroundColor: '#673ab7' },
  optionLabel: { fontSize: 14, color: '#3c4043' },
  optionLabelActive: { color: '#673ab7', fontWeight: 'bold' },
  textInput: { borderBottomWidth: 1, borderColor: '#673ab7', paddingVertical: 8, fontSize: 15, color: '#202124' },
  
  // Footer Estilo "Sticky"
  stickyFooter: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'white', flexDirection: 'row', 
    justifyContent: 'space-between', padding: 15, 
    borderTopWidth: 1, borderTopColor: '#ddd',
    elevation: 10
  },
  btnCancel: { flex: 0.45, padding: 15, alignItems: 'center', borderRadius: 4, borderWidth: 1, borderColor: '#673ab7' },
  btnCancelText: { color: '#673ab7', fontWeight: 'bold' },
  btnSubmit: { flex: 0.45, backgroundColor: '#673ab7', padding: 15, borderRadius: 4, alignItems: 'center' },
  btnSubmitText: { color: 'white', fontWeight: 'bold' }
});

export default TakeSurveyScreen;