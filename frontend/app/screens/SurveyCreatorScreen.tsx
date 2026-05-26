import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Question, Survey, Category, Genere } from "../types/formsSurvey.types";
import { FormApiService } from "../services/api/service";
import { QuestionCard } from "../components/QuestionCard/QuestionCard";
import { SurveySidebar } from "../components/QuestionCard/SurveySidebar";
import styles, { colors } from "./stylesGlobal";
import { useLayout } from "@/app/utils/useLayout";
import { ResponsiveLayout } from "../components/ResponsiveLayout";
import { useAuth } from "./Auth/AuthContext";

const SurveyCreatorScreen = ({ navigation, route }: any) => {
    const { isDesktopView } = useLayout();
    const { user } = useAuth();
    
    // Detectamos si venimos de "Editar"
    const surveyToEdit = route.params?.surveyEdit as Survey | undefined;
    const isEditing = !!surveyToEdit;

    const [loading, setLoading] = useState(false);
    const [loadingMetadata, setLoadingMetadata] = useState(true);

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [availableGeneres, setAvailableGeneres] = useState<Genere[]>([]);

    const [survey, setSurvey] = useState<Survey>({
        name: "",
        numUsers: 0,
        numQuestions: 0,
        questionList: [],
        categoryList: [],
        genereList: [],
        launchDate: new Date().toISOString(),
        closeDate: "",
		status: false,
    });

    useEffect(() => {
        const initData = async () => {
            try {
                // 1. Cargar Metadatos
                const [cats, gens] = await Promise.all([
                    FormApiService.getCategories(),
                    FormApiService.getGeneres(),
                ]);
                setAvailableCategories(cats);
                setAvailableGeneres(gens);

                // 2. Si es edición, cargar los datos recibidos
                if (isEditing && surveyToEdit) {
                    setSurvey(surveyToEdit);
                }
            } catch (error) {
                console.error("Error inicializando:", error);
            } finally {
                setLoadingMetadata(false);
            }
        };
        initData();
    }, [isEditing, surveyToEdit]);

    const addQuestion = () => {
        const newQuestion: Question = {
            textQuestion: "",
            config: {
                typeName: "SHORT_TEXT",
                isMultiple: false,
                attributes: "",
            },
            option: [],
        } as any;

        setSurvey({
            ...survey,
            questionList: [...survey.questionList, newQuestion],
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

    const updateType = (index: number, type: any) => {
        const updated = [...survey.questionList];
        updated[index].config = {
            typeName: type,
            isMultiple: type === "MULTIPLE_CHOICE",
            attributes: "",
        };
        updated[index].option =
            type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE"
                ? [{ textOpcion: "" }]
                : [];
        setSurvey({ ...survey, questionList: updated });
    };

    const addOption = (qIndex: number) => {
        const updated = [...survey.questionList];
        if (!updated[qIndex].option) updated[qIndex].option = [];
        updated[qIndex].option!.push({ textOpcion: "" });
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
            // Aquí podrías diferenciar entre un PUT (update) o POST (submit) si tu API lo requiere
            await FormApiService.submitForm(survey, user.id);
            Alert.alert("Éxito", isEditing ? "Encuesta actualizada." : "Encuesta publicada.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingMetadata)
        return (
            <View style={[styles.alineadoPersonal, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );

    return (
        <View style={styles.alineadoPersonal}>
            <ResponsiveLayout fullWidth={true}>
                <View style={{ padding: 20, width: "100%" }}>
                    
                    {/* Cabecera con Botón Atrás */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 }}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            style={{ backgroundColor: colors.darkCard, padding: 10, borderRadius: 12 }}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.tituloHero, { fontSize: isDesktopView ? 40 : 28, marginBottom: 0 }]}>
                            {isEditing ? "Editar" : "Nuevo"}{" "}
                            <Text style={styles.destaqueAzul}>Proyecto</Text>
                        </Text>
                    </View>

                    {/* Cuerpo de la pantalla */}
                    <View
                        style={{
                            flexDirection: isDesktopView ? "row" : "column",
                            width: "100%",
                            gap: 30,
                        }}
                    >
                        {/* COLUMNA IZQUIERDA (Preguntas) */}
                        <View style={{ flex: isDesktopView ? 2 : 1 }}>
                            <TextInput
                                placeholder="Título de la Encuesta..."
                                placeholderTextColor="#666"
                                style={[styles.inputTitulo, { marginBottom: 20 }]}
                                value={survey.name}
                                onChangeText={(text) => setSurvey({ ...survey, name: text })}
                            />

                            <FlatList
                                data={survey.questionList}
                                keyExtractor={(_, index) => index.toString()}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => (
                                    <QuestionCard
                                        question={{
                                            ...item,
                                            typeName: item.config?.typeName || "SHORT_TEXT",
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
                                        style={[styles.btnSecondary, { borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary }]}
                                        onPress={addQuestion}
                                    >
                                        <Ionicons name="add-circle-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                                        <Text style={{ color: colors.textMain, fontWeight: "bold" }}>
                                            AÑADIR PREGUNTA
                                        </Text>
                                    </TouchableOpacity>
                                }
                            />

                            <TouchableOpacity
                                style={[styles.btnPrimary, { marginTop: 30, height: 55 }]}
                                onPress={handleSaveSurvey}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.btnPrimaryText}>
                                        {isEditing ? "GUARDAR CAMBIOS" : "CREAR ENCUESTA"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* COLUMNA DERECHA (Sidebar) */}
                        <View style={{ flex: 1, minWidth: isDesktopView ? 300 : "100%" }}>
                            <SurveySidebar
                                survey={survey}
                                setSurvey={setSurvey}
                                availableCategories={availableCategories}
                                availableGeneres={availableGeneres}
                            />
                        </View>
                    </View>
                </View>
            </ResponsiveLayout>
        </View>
    );
};

export default SurveyCreatorScreen;