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
} from "react-native";
import { FormApiService } from "../services/api/service";
import {
    EncuestaParcialDTO,
    EncuestaRespuestaDTO,
} from "../types/formsSurvey.types";
import { useAuth } from "../screens/Auth/AuthContext";

const TakeSurveyScreen = ({ route, navigation }: any) => {
    // 1. Parámetros y Contexto
    const { surveyId } = route.params;
    const { user, loading: authLoading } = useAuth(); 
    
    // 2. Estados
    const [survey, setSurvey] = useState<EncuestaParcialDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [respuestasUser, setRespuestasUser] = useState<Record<number, any>>({});

    // 3. Carga de datos Sincronizada
    useEffect(() => {
        const loadData = async () => {
            if (authLoading) return;

            if (!user || !user.id) {
                console.log("Esperando datos de sesión...");
                return;
            }

            if (!surveyId) {
                Alert.alert("Error", "No se especificó el ID de la encuesta.");
                navigation.goBack();
                return;
            }

            try {
                setLoading(true);
                console.log(`Cargando encuesta ${surveyId} para usuario ${user.id}`);
                const data = await FormApiService.getPartialResponse(surveyId, user.id);
                
                setSurvey(data);

                // Pre-cargar respuestas si ya existen (borradores previos)
                if (data.preguntas) {
                    const initial: Record<number, any> = {};
                    data.preguntas.forEach(p => {
                        if (p.idOpcionSeleccionada) {
                            initial[p.idPregunta] = p.idOpcionSeleccionada;
                        } else if (p.valorRespuesta) {
                            initial[p.idPregunta] = p.valorRespuesta;
                        }
                    });
                    setRespuestasUser(initial);
                }
            } catch (err) {
                console.error("Error API:", err);
                Alert.alert("Error", "No se pudo obtener la encuesta del servidor.");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [surveyId, user?.id, authLoading]);

    // 4. Manejadores
    const handleSelect = (qId: number, oId: number) => {
        setRespuestasUser((prev) => ({ ...prev, [qId]: oId }));
    };

    const handleSave = async (isFinal: boolean) => {
        if (!user?.id) {
            Alert.alert("Error", "Sesión no válida.");
            return;
        }

        // Mapeo riguroso de tipos para evitar el Error 400 en el Backend
        const payload: EncuestaRespuestaDTO = {
            idEncuesta: Number(surveyId),
            idUser: Number(user.id),
            respuestas: Object.entries(respuestasUser).map(([qId, val]) => ({
                idPregunta: parseInt(qId),
                idOpcion: typeof val === "number" ? val : undefined,
                valor: typeof val === "string" ? val : "",
                isRespondida: true,
            })),
        };

        try {
            setLoading(true);
            // Llamamos a la API
            const response = await FormApiService.saveAnswers(payload, isFinal);
            
            // Si llegamos aquí, el backend devolvió 200 OK
            Alert.alert(
                isFinal ? "¡Encuesta Finalizada!" : "Progreso Guardado",
                isFinal 
                    ? "Tus respuestas han sido enviadas correctamente. ¡Gracias!" 
                    : "Tus respuestas parciales se han guardado con éxito.",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            // Volvemos a la pantalla anterior (SurveyList)
                            navigation.navigate("SurveyList");
                        } 
                    }
                ],
                { cancelable: false }
            );
        } catch (e: any) {
            console.error("Error al guardar:", e);
            Alert.alert(
                "Error", 
                "No se pudo guardar la encuesta. Verifica tu conexión a internet."
            );
        } finally {
            setLoading(false);
        }
    };

    // 5. Renders de carga
    if (authLoading || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#64B5F6" />
                <Text style={{ color: "#fff", marginTop: 15 }}>
                    {authLoading ? "Sincronizando sesión..." : "Descargando preguntas..."}
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#000" }}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 150 }} // Espacio extra para el footer
            >
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.accentBar} />
                    <Text style={styles.titleText}>
                        {survey?.nombreEncuesta || "Cargando..."}
                    </Text>
                    <Text style={styles.subtitleText}>
                        {survey?.completada
                            ? "✓ Ya has completado esta encuesta."
                            : "Por favor, completa los campos requeridos:"}
                    </Text>
                </View>

                {/* Lista de Preguntas */}
                {survey?.preguntas?.map((pregunta: any) => {
                    const opciones = pregunta.opcionesDisponibles || [];
                    const isChoice = opciones.length > 0;
                    const resValue = respuestasUser[pregunta.idPregunta];

                    return (
                        <View key={pregunta.idPregunta} style={styles.questionCard}>
                            <Text style={styles.questionTitle}>
                                {pregunta.textoPregunta}
                            </Text>

                            {isChoice ? (
                                opciones.map((opcio: any) => {
                                    const selected = Number(resValue) === Number(opcio.idOpcion);
                                    return (
                                        <TouchableOpacity
                                            key={opcio.idOpcion}
                                            style={[styles.optionRow, selected && styles.optionRowSelected]}
                                            onPress={() => handleSelect(pregunta.idPregunta, opcio.idOpcion)}
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
                                    style={[styles.textInput, { textAlignVertical: 'top' }]}
                                    placeholder="Escribe aquí tu respuesta..."
                                    placeholderTextColor="#555"
                                    value={resValue?.toString() || ""}
                                    onChangeText={(text) =>
                                        setRespuestasUser((prev) => ({ ...prev, [pregunta.idPregunta]: text }))
                                    }
                                    multiline
                                />
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Footer de Acciones - Solo se muestra si no está completada */}
            {!survey?.completada && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.btnBack}
                        onPress={() => handleSave(false)} 
                    >
                        <Text style={{ color: "#64B5F6", fontWeight: "bold" }}>BORRADOR</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.btnSave}
                        onPress={() => handleSave(true)}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>FINALIZAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    container: { flex: 1, backgroundColor: "#000", padding: 16 },
    headerCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 15,
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#333",
    },
    accentBar: { height: 6, backgroundColor: "#5b55c0" },
    titleText: { fontSize: 22, padding: 20, fontWeight: "bold", color: "#fff" },
    subtitleText: { paddingHorizontal: 20, paddingBottom: 20, color: "#888", fontSize: 14 },
    questionCard: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    questionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 20, color: "#64B5F6" },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    optionRowSelected: { backgroundColor: "rgba(100, 181, 246, 0.1)" },
    radioOuter: {
        height: 22,
        width: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#444",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: "#64B5F6" },
    selectedBorder: { borderColor: "#64B5F6" },
    selectedLabel: { color: "#fff", fontWeight: "bold" },
    optionLabel: { fontSize: 16, color: "#ccc" },
    textInput: {
        backgroundColor: "#0e0d0d",
        color: "#FFF",
        borderRadius: 10,
        padding: 15,
        minHeight: 100,
        borderWidth: 1,
        borderColor: "#333",
        fontSize: 16,
    },
    footer: {
        position: "absolute",   
        bottom: 0, left: 0, right: 0,
        backgroundColor: "#1a1a1a",
        flexDirection: "row",
        padding: 20,
        paddingBottom: Platform.OS === "ios" ? 35 : 20,
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#333",
        elevation: 10,
    },
    btnBack: {
        padding: 15, width: "48%", alignItems: "center",
        borderRadius: 10, borderWidth: 1, borderColor: "#64B5F6",
    },
    btnSave: {
        padding: 15, width: "48%", alignItems: "center",
        borderRadius: 10, backgroundColor: "#5b55c0",
    },
});

export default TakeSurveyScreen;