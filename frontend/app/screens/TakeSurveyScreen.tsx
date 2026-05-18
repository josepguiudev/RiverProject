import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { FormApiService } from "../services/api/service";
import { EncuestaParcialDTO, EncuestaRespuestaDTO } from "../types/formsSurvey.types";
import { useAuth } from "../screens/Auth/AuthContext";
import { useLayout } from "@/app/utils/useLayout";
import stylesGlobal, { colors } from "./stylesGlobal";
import { isWeb } from "../utils/device";
import { Ionicons } from "@expo/vector-icons";

const TakeSurveyScreen = ({ route, navigation }: any) => {
  const { surveyId } = route.params;
  const { user, loading: authLoading } = useAuth();
  const { isDesktopView } = useLayout();

  const [survey, setSurvey] = useState<EncuestaParcialDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [respuestasUser, setRespuestasUser] = useState<Record<number, any>>({});

  useEffect(() => {
    const loadData = async () => {
      if (authLoading || !user?.id || !surveyId) return;
      try {
        setLoading(true);
        const data = await FormApiService.getPartialResponse(surveyId, user.id);
        setSurvey(data);
        if (data.preguntas) {
          const initial: Record<number, any> = {};
          data.preguntas.forEach((p) => {
            if (p.esMultiple) {
              initial[p.idPregunta] = p.idsOpcionesSeleccionadas || [];
            } else if (p.idOpcionSeleccionada) {
              initial[p.idPregunta] = [p.idOpcionSeleccionada];
            } else if (p.valorRespuesta) {
              initial[p.idPregunta] = p.valorRespuesta;
            } else {
              initial[p.idPregunta] = p.esMultiple ? [] : (p.opcionesDisponibles?.length ? [] : "");
            }
          });
          setRespuestasUser(initial);
        }
      } catch (err) {
        Alert.alert("Error", "No se pudo obtener la encuesta.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [surveyId, user?.id, authLoading]);

  const handleSelect = (qId: number, oId: number, isMultiple: boolean) => {
    if (survey?.completada) return;
    setRespuestasUser((prev) => {
      const currentRes = Array.isArray(prev[qId]) ? prev[qId] : [];
      if (isMultiple) {
        const exists = currentRes.includes(oId);
        const nextRes = exists ? currentRes.filter((id: number) => id !== oId) : [...currentRes, oId];
        return { ...prev, [qId]: nextRes };
      } else {
        return { ...prev, [qId]: [oId] };
      }
    });
  };

  const handleSave = async (isFinal: boolean) => {
    if (!user?.id || !survey || survey.completada) return;
    const respuestasFormateadas = Object.entries(respuestasUser).flatMap(([qId, val]) => {
      if (Array.isArray(val)) {
        return val.map((optionId) => ({
          idPregunta: parseInt(qId),
          idOpcion: optionId,
          valor: "",
          isRespondida: true,
        }));
      }
      return [
        {
          idPregunta: parseInt(qId),
          idOpcion: undefined,
          valor: val ? val.toString() : "",
          isRespondida: val ? val.toString().trim().length > 0 : false,
        },
      ];
    });
    const payload: EncuestaRespuestaDTO = {
      idEncuesta: Number(surveyId),
      idUser: Number(user.id),
      respuestas: respuestasFormateadas,
    };
    try {
      setLoading(true);
      await FormApiService.saveAnswers(payload, isFinal);
      if (isFinal) {
        setSurvey((prev) => (prev ? { ...prev, completada: true } : null));
        Alert.alert("¡Gracias!", "Encuesta enviada con éxito.", [
          { text: "OK", onPress: () => navigation.navigate("SurveyList") },
        ]);
      } else {
        Alert.alert("Guardado", "Borrador guardado correctamente.");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la respuesta.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  // ============================================================
  //  VERSIÓN WEB (exactamente igual al original)
  // ============================================================
  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            stylesWeb.scrollContent,
            isDesktopView && stylesWeb.scrollContentDesktop,
          ]}
        >
          <TouchableOpacity style={stylesWeb.backButtonTop} onPress={() => navigation.navigate("SurveyList")}>
            <Text style={stylesWeb.backButtonText}>← Volver al listado</Text>
          </TouchableOpacity>

          <View style={stylesWeb.headerCard}>
            <View style={[stylesWeb.accentBar, { backgroundColor: survey?.completada ? "#28a745" : "#5b55c0" }]} />
            <Text style={stylesWeb.titleText}>{survey?.nombreEncuesta}</Text>
            <View style={stylesWeb.statusRow}>
              <View style={[stylesWeb.statusDot, { backgroundColor: survey?.completada ? "#28a745" : "#fd7e14" }]} />
              <Text style={{ color: survey?.completada ? "#28a745" : "#fd7e14", fontWeight: "bold" }}>
                {survey?.completada ? "COMPLETADA" : "PENDIENTE"}
              </Text>
            </View>
          </View>

          {survey?.preguntas?.map((pregunta) => {
            const opciones = pregunta.opcionesDisponibles || [];
            const resValue = respuestasUser[pregunta.idPregunta];
            return (
              <View key={pregunta.idPregunta} style={stylesWeb.questionCard}>
                <Text style={stylesWeb.questionTitle}>{pregunta.textoPregunta}</Text>
                {opciones.length > 0 ? (
                  opciones.map((opcio) => {
                    const selected = Array.isArray(resValue) && resValue.includes(opcio.idOpcion);
                    return (
                      <TouchableOpacity
                        key={opcio.idOpcion}
                        disabled={survey?.completada}
                        style={[stylesWeb.optionRow, selected && stylesWeb.optionRowSelected]}
                        onPress={() => handleSelect(pregunta.idPregunta, opcio.idOpcion, pregunta.esMultiple)}
                      >
                        <View
                          style={[
                            stylesWeb.radioOuter,
                            { borderRadius: pregunta.esMultiple ? 4 : 12 },
                            selected && stylesWeb.selectedBorder,
                          ]}
                        >
                          {selected && <View style={[stylesWeb.radioInner, { borderRadius: pregunta.esMultiple ? 2 : 6 }]} />}
                        </View>
                        <Text style={[stylesWeb.optionLabel, selected && stylesWeb.selectedLabel]}>{opcio.textoOpcion}</Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <TextInput
                    style={stylesWeb.textInput}
                    value={typeof resValue === "string" ? resValue : ""}
                    onChangeText={(text) => setRespuestasUser((p) => ({ ...p, [pregunta.idPregunta]: text }))}
                    placeholder="Escribe tu respuesta..."
                    placeholderTextColor="#444"
                    multiline
                    editable={!survey?.completada}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>

        {!survey?.completada && (
          <View style={[stylesWeb.footer, isDesktopView && stylesWeb.footerDesktop]}>
            <View style={stylesWeb.footerInner}>
              <TouchableOpacity style={stylesWeb.btnDraft} onPress={() => handleSave(false)}>
                <Text style={{ color: "#64B5F6", fontWeight: "bold" }}>BORRADOR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesWeb.btnFinalize} onPress={() => handleSave(true)}>
                <Text style={{ color: "white", fontWeight: "bold" }}>FINALIZAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil, sin footer absoluto)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, paddingTop: 16 }}
      >
        {/* Botón volver */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SurveyList")}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, paddingVertical: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "600", marginLeft: 8 }}>Volver al listado</Text>
        </TouchableOpacity>

        {/* Encabezado */}
        <View style={{ backgroundColor: "#111", borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: "#333", overflow: "hidden" }}>
          <View style={{ height: 4, backgroundColor: survey?.completada ? "#28a745" : "#5b55c0" }} />
          <Text style={{ fontSize: 24, padding: 20, fontWeight: "bold", color: "#fff" }}>{survey?.nombreEncuesta}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 20, paddingBottom: 20 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: survey?.completada ? "#28a745" : "#fd7e14", marginRight: 10 }} />
            <Text style={{ color: survey?.completada ? "#28a745" : "#fd7e14", fontWeight: "bold" }}>
              {survey?.completada ? "COMPLETADA" : "PENDIENTE"}
            </Text>
          </View>
        </View>

        {/* Preguntas */}
        {survey?.preguntas?.map((pregunta) => {
          const opciones = pregunta.opcionesDisponibles || [];
          const resValue = respuestasUser[pregunta.idPregunta];
          return (
            <View key={pregunta.idPregunta} style={{ backgroundColor: "#111", padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }}>
              <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: colors.primary }}>{pregunta.textoPregunta}</Text>
              {opciones.length > 0 ? (
                opciones.map((opcio) => {
                  const selected = Array.isArray(resValue) && resValue.includes(opcio.idOpcion);
                  return (
                    <TouchableOpacity
                      key={opcio.idOpcion}
                      disabled={survey?.completada}
                      onPress={() => handleSelect(pregunta.idPregunta, opcio.idOpcion, pregunta.esMultiple)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 14,
                        marginBottom: 10,
                        backgroundColor: selected ? "rgba(100, 181, 246, 0.1)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <View
                        style={{
                          height: 24,
                          width: 24,
                          borderWidth: 2,
                          borderColor: selected ? colors.primary : "#444",
                          borderRadius: pregunta.esMultiple ? 6 : 12,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 15,
                        }}
                      >
                        {selected && (
                          <View
                            style={{
                              height: 12,
                              width: 12,
                              backgroundColor: colors.primary,
                              borderRadius: pregunta.esMultiple ? 2 : 6,
                            }}
                          />
                        )}
                      </View>
                      <Text style={{ fontSize: 16, color: selected ? "#fff" : "#ccc", fontWeight: selected ? "bold" : "normal" }}>
                        {opcio.textoOpcion}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <TextInput
                  style={{
                    backgroundColor: "#080808",
                    color: "#FFF",
                    borderRadius: 16,
                    padding: 16,
                    minHeight: 120,
                    borderWidth: 1,
                    borderColor: "#222",
                    fontSize: 16,
                    textAlignVertical: "top",
                  }}
                  value={typeof resValue === "string" ? resValue : ""}
                  onChangeText={(text) => setRespuestasUser((p) => ({ ...p, [pregunta.idPregunta]: text }))}
                  placeholder="Escribe tu respuesta..."
                  placeholderTextColor="#666"
                  multiline
                  editable={!survey?.completada}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer fijo (no absoluto) para guardar */}
      {!survey?.completada && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: "#222", backgroundColor: colors.background }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 16, alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.primary }}
              onPress={() => handleSave(false)}
            >
              <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 16 }}>GUARDAR BORRADOR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 16, alignItems: "center", borderRadius: 16, backgroundColor: colors.primary, elevation: 4 }}
              onPress={() => handleSave(true)}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>FINALIZAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// ==================== ESTILOS ORIGINALES (solo para web) ====================
const stylesWeb = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  scrollContentDesktop: { alignSelf: "center", width: "100%", maxWidth: 900 },
  backButtonTop: { marginBottom: 20, paddingVertical: 10 },
  backButtonText: { color: "#64B5F6", fontSize: 16, fontWeight: "600" },
  headerCard: { backgroundColor: "#111", borderRadius: 15, marginBottom: 25, borderWidth: 1, borderColor: "#333", overflow: "hidden" },
  accentBar: { height: 4 },
  titleText: { fontSize: 24, padding: 20, fontWeight: "bold", color: "#fff" },
  statusRow: { flexDirection: "row", alignItems: "center", paddingLeft: 20, paddingBottom: 20 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  questionCard: { backgroundColor: "#111", padding: 25, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  questionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20, color: "#64B5F6" },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, marginBottom: 8, backgroundColor: "rgba(255,255,255,0.02)" },
  optionRowSelected: { backgroundColor: "rgba(100, 181, 246, 0.08)" },
  radioOuter: { height: 22, width: 22, borderWidth: 2, borderColor: "#444", marginRight: 15, justifyContent: "center", alignItems: "center" },
  radioInner: { height: 12, width: 12, backgroundColor: "#64B5F6" },
  selectedBorder: { borderColor: "#64B5F6" },
  optionLabel: { fontSize: 16, color: "#ccc" },
  selectedLabel: { color: "#fff", fontWeight: "bold" },
  textInput: { backgroundColor: "#080808", color: "#FFF", borderRadius: 12, padding: 15, minHeight: 120, borderWidth: 1, borderColor: "#222", fontSize: 16, textAlignVertical: "top" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#000", borderTopWidth: 1, borderTopColor: "#222", padding: 20, paddingBottom: Platform.OS === "ios" ? 40 : 20 },
  footerDesktop: { alignItems: "center" },
  footerInner: { flexDirection: "row", justifyContent: "space-between", width: "100%", maxWidth: 900 },
  btnDraft: { padding: 16, width: "48%", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#64B5F6" },
  btnFinalize: { padding: 16, width: "48%", alignItems: "center", borderRadius: 12, backgroundColor: "#5b55c0" },
});

export default TakeSurveyScreen;