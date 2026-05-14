import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
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
import { isWeb } from "../utils/device";

const SurveyCreatorScreen = ({ navigation }: any) => {
    const { isDesktopView } = useLayout();
    const { user } = useAuth();

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
    });

    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [cats, gens] = await Promise.all([
                    FormApiService.getCategories(),
                    FormApiService.getGeneres(),
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
            await FormApiService.submitForm(survey, user.id);
            Alert.alert("Éxito", "Encuesta publicada correctamente.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingMetadata)
        return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

    // ============================================================
    //  VERSIÓN WEB (original, sin cambios)
    // ============================================================
    if (isWeb) {
        return (
            <View style={styles.alineadoPersonal}>
                <ResponsiveLayout fullWidth={true}>
                    <View style={{ padding: 20, width: "100%" }}>
                        <View style={{ marginBottom: 30 }}>
                            <Text style={styles.tituloHero}>
                                Nuevo <Text style={styles.destaqueAzul}>Proyecto</Text>
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: isDesktopView ? "row" : "column",
                                width: "100%",
                                gap: 30,
                            }}
                        >
                            {/* Columna izquierda – preguntas */}
                            <View style={{ flex: isDesktopView ? 2 : 1 }}>
                                <TextInput
                                    placeholder="Título de la Encuesta..."
                                    placeholderTextColor="#666"
                                    style={styles.inputTitulo}
                                    value={survey.name}
                                    onChangeText={(text) =>
                                        setSurvey({ ...survey, name: text })
                                    }
                                />

                                <FlatList
                                    data={survey.questionList}
                                    keyExtractor={(_, index) => index.toString()}
                                    scrollEnabled={false}
                                    renderItem={({ item, index }) => (
                                        <QuestionCard
                                            question={
                                                {
                                                    ...item,
                                                    typeName: item.config?.typeName || "SHORT_TEXT",
                                                } as any
                                            }
                                            index={index}
                                            onUpdateQuestion={(text) =>
                                                updateQuestionText(index, text)
                                            }
                                            onRemoveQuestion={() => removeQuestion(index)}
                                            onUpdateType={(type) => updateType(index, type)}
                                            onAddOption={() => addOption(index)}
                                            onUpdateOption={(text, oIndex) =>
                                                updateOptionText(index, oIndex, text)
                                            }
                                        />
                                    )}
                                    ListFooterComponent={
                                        <TouchableOpacity
                                            style={styles.btnSecondary}
                                            onPress={addQuestion}
                                        >
                                            <Text style={{ color: colors.text, fontWeight: "bold" }}>
                                                + AÑADIR PREGUNTA
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />

                                <TouchableOpacity
                                    style={[styles.btnPrimary, { marginTop: 30 }]}
                                    onPress={handleSaveSurvey}
                                    disabled={loading}
                                >
                                    <Text style={styles.btnPrimaryText}>
                                        {loading ? "PUBLICANDO..." : "PUBLICAR PROYECTO"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Columna derecha – configuraciones */}
                            <View
                                style={{
                                    flex: 1,
                                    minWidth: isDesktopView ? 300 : "100%",
                                }}
                            >
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
    }

    // ============================================================
    //  VERSIÓN ANDROID (con botón de volver a ClientDashboard)
    // ============================================================
    const goBack = () => {
        navigation.navigate("ClientDashboard");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, paddingTop: 20 }}
            >
                {/* Header con botón de volver y título */}
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <TouchableOpacity onPress={goBack} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back-outline" size={28} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.white }}>
                        Nuevo <Text style={{ color: colors.secondary }}>Proyecto</Text>
                    </Text>
                </View>

                {/* Input del título */}
                <TextInput
                    placeholder="Título de la encuesta..."
                    placeholderTextColor="#888"
                    style={{
                        backgroundColor: "#1A1A1A",
                        color: "white",
                        fontSize: 20,
                        padding: 16,
                        borderRadius: 16,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: "#333",
                    }}
                    value={survey.name}
                    onChangeText={(text) => setSurvey({ ...survey, name: text })}
                />

                {/* Lista de preguntas */}
                {survey.questionList.map((_, idx) => (
                    <QuestionCard
                        key={idx}
                        question={
                            {
                                ...survey.questionList[idx],
                                typeName: survey.questionList[idx].config?.typeName || "SHORT_TEXT",
                            } as any
                        }
                        index={idx}
                        onUpdateQuestion={(text) => updateQuestionText(idx, text)}
                        onRemoveQuestion={() => removeQuestion(idx)}
                        onUpdateType={(type) => updateType(idx, type)}
                        onAddOption={() => addOption(idx)}
                        onUpdateOption={(text, oIdx) => updateOptionText(idx, oIdx, text)}
                    />
                ))}

                {/* Botón añadir pregunta */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "transparent",
                        borderWidth: 1.5,
                        borderColor: colors.primary,
                        borderRadius: 16,
                        paddingVertical: 14,
                        marginVertical: 16,
                        alignItems: "center",
                    }}
                    onPress={addQuestion}
                >
                    <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "bold" }}>
                        + AÑADIR PREGUNTA
                    </Text>
                </TouchableOpacity>

                {/* Botón publicar */}
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.cta,
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: "center",
                        marginTop: 8,
                        marginBottom: 20,
                        elevation: 4,
                    }}
                    onPress={handleSaveSurvey}
                    disabled={loading}
                >
                    <Text style={{ color: "#1D2735", fontSize: 18, fontWeight: "bold" }}>
                        {loading ? "PUBLICANDO..." : "PUBLICAR PROYECTO"}
                    </Text>
                </TouchableOpacity>

                {/* Sidebar (configuraciones) */}
                <View style={{ marginVertical: 8 }}>
                    <SurveySidebar
                        survey={survey}
                        setSurvey={setSurvey}
                        availableCategories={availableCategories}
                        availableGeneres={availableGeneres}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SurveyCreatorScreen;