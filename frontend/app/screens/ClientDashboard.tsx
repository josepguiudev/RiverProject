import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { FormApiService } from "../services/api/service";
import { useAuth } from "./Auth/AuthContext";
import { useLayout } from "@/app/utils/useLayout";
import { Survey } from "../types/formsSurvey.types";
import styles, { colors } from "./stylesGlobal";
import { ResponsiveLayout } from "../components/ResponsiveLayout";
import { isWeb } from "../utils/device";
import client from "../api/client";

import MenuButton from "@/app/components/Menu/MenuButton";
import MenuPrincipal from "@/app/components/Menu/CustomMenu";

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const { isDesktopView } = useLayout();

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const isAdmin = user?.role === "ADMIN";
    const neutralFont = Platform.OS === "ios" ? "System" : "sans-serif";

    const fetchSurveys = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            let data: Survey[] = [];

            if (isAdmin) {
                data = await FormApiService.getAllSurveys();
                console.log(
                    "Cargando todas las encuestas de la base de datos (Modo Admin)",
                );
            } else {
                data = await FormApiService.getSurveysByClient(user.id);
                console.log(
                    `Cargando encuestas asignadas al cliente: ${user.id}`,
                );
            }

            setSurveys(data);
        } catch (error) {
            console.error("Error al cargar proyectos/encuestas:", error);
            Alert.alert("Error", "No se pudieron recuperar las encuestas.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSurveys();
        }, [user?.id, user?.role]),
    );

    const handlePublish = async (surveyId: number) => {
        try {
            await FormApiService.publishSurvey(surveyId);
            Alert.alert("Éxito", "Encuesta publicada correctamente.");
            fetchSurveys();
        } catch (error) {
            Alert.alert("Error", "No se pudo publicar la encuesta.");
        }
    };

    const handleAssignToUsers = async (surveyId: number, numUsers: number) => {
        setAssigningId(surveyId);
        try {
            const response = await client.post(
                `/api/auth2/assign-survey/${surveyId}?limit=${numUsers}`,
            );
            if (response.status === 200) {
                Alert.alert(
                    "Éxito",
                    `Encuesta asignada a ${numUsers} usuarios.`,
                );
                fetchSurveys();
            }
        } catch (error) {
            Alert.alert("Error", "Error en la asignación.");
        } finally {
            setAssigningId(null);
        }
    };

    const handlePressAnalysis = (item: any) => {
        navigation.navigate("SurveyAnalytics", {
            surveyId: item.id,
            title: item.name,
            idCreador: item.idClient,
        });
    };

    const renderActionButtons = (item: Survey) => {
        const isPublished = item.status === true;

        return (
            <View style={styles.contenedorBotonesTarjeta}>
                <TouchableOpacity
                    style={[
                        styles.botonResultados,
                        { flex: 1, minWidth: 100, height: 42 },
                    ]}
                    onPress={() => {
                        if (isAdmin) {
                            if (item.supersetID) {
                                navigation.navigate("AdminGraphics", {
                                    supersetID: item.supersetID,
                                    title: item.name,
                                });
                            } else {
                                Alert.alert(
                                    "Aviso",
                                    "Sin dashboard vinculado para Administrador.",
                                );
                            }
                        } else {
                            handlePressAnalysis(item);
                        }
                    }}
                >
                    <MaterialCommunityIcons
                        name="chart-box-outline"
                        size={18}
                        color={colors.primary}
                    />
                    <Text
                        style={[
                            styles.textoBotonResultados,
                            { fontFamily: neutralFont, marginLeft: 4 },
                        ]}
                    >
                        ANÁLISIS
                    </Text>
                </TouchableOpacity>

                {isAdmin ? (
                    <>
                        {!isPublished && (
                            <TouchableOpacity
                                style={[
                                    styles.botonResultados,
                                    {
                                        borderColor: "#22C55E",
                                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                                        flex: 1,
                                        minWidth: 100,
                                        height: 42,
                                    },
                                ]}
                                onPress={() => handlePublish(item.id!)}
                            >
                                <Ionicons
                                    name="rocket-outline"
                                    size={18}
                                    color="#22C55E"
                                />
                                <Text
                                    style={[
                                        styles.textoBotonResultados,
                                        { color: "#22C55E", marginLeft: 4 },
                                    ]}
                                >
                                    PUBLICAR
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.botonResultados,
                                {
                                    borderColor: colors.secondary,
                                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                                    flex: 1,
                                    minWidth: 100,
                                    height: 42,
                                },
                            ]}
                            onPress={() =>
                                handleAssignToUsers(
                                    item.id!,
                                    item.numUsers || 0,
                                )
                            }
                            disabled={assigningId === item.id}
                        >
                            {assigningId === item.id ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.secondary}
                                />
                            ) : (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <Ionicons
                                        name="person-add-outline"
                                        size={18}
                                        color={colors.secondary}
                                    />
                                    <Text
                                        style={[
                                            styles.textoBotonResultados,
                                            {
                                                color: colors.secondary,
                                                fontWeight: "700",
                                            },
                                        ]}
                                    >
                                        ASIGNAR
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {!isPublished && (
                            <TouchableOpacity
                                style={[
                                    styles.botonResultados,
                                    {
                                        borderColor: "#EAB308",
                                        backgroundColor: "rgba(234, 179, 8, 0.1)",
                                        flex: 1,
                                        minWidth: 100,
                                        height: 42,
                                    },
                                ]}
                                onPress={() =>
                                    navigation.navigate("SurveyCreator", {
                                        surveyEdit: item,
                                    })
                                }
                            >
                                <Ionicons
                                    name="create-outline"
                                    size={18}
                                    color="#EAB308"
                                />
                                <Text
                                    style={[
                                        styles.textoBotonResultados,
                                        { color: "#EAB308", marginLeft: 4 },
                                    ]}
                                >
                                    EDITAR
                                </Text>
                            </TouchableOpacity>
                        )}

                        {isPublished && (
                            <View
                                style={[
                                    styles.botonResultados,
                                    {
                                        borderColor: "gray",
                                        opacity: 0.6,
                                        flex: 1,
                                        minWidth: 100,
                                        height: 42,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={18}
                                    color="gray"
                                />
                                <Text
                                    style={[
                                        styles.textoBotonResultados,
                                        { color: "gray", marginLeft: 4 },
                                    ]}
                                >
                                    ACTIVA
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView
            style={[
                styles.alineadoPersonal,
                { backgroundColor: colors.background, flex: 1 },
            ]}
        >
            <MenuButton onPress={() => setMenuVisible(true)} />

            <ResponsiveLayout fullWidth={true}>
                <ScrollView
                    contentContainerStyle={{
                        padding: isWeb ? 40 : 20,
                        paddingTop: Platform.OS === "web" ? 80 : 90,
                    }}
                >
                    {/* CABECERA CORREGIDA: Sin saltos de línea peligrosos */}
                    <View style={{ marginBottom: 30 }}>
                        <Text style={[styles.tituloHero, { textAlign: "left", marginBottom: 0 }]}>
                            {"Panel de "}
                            <Text style={styles.destaqueAzul}>
                                {isAdmin ? "Administrador global" : "Empresa"}
                            </Text>
                        </Text>
                        <Text
                            style={{
                                color: "#888",
                                marginTop: 5,
                                fontSize: 14,
                            }}
                        >
                            {user?.email || "Bienvenido"}
                        </Text>
                    </View>

                    {/* Botón Nueva Encuesta */}
                    {!isAdmin && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("SurveyCreator")}
                            style={[
                                styles.botonGrande,
                                {
                                    flexDirection: "row",
                                    gap: 10,
                                    marginBottom: 30,
                                    alignSelf: isWeb ? "flex-start" : "stretch",
                                },
                            ]}
                        >
                            <Ionicons
                                name="add-circle"
                                size={24}
                                color="white"
                            />
                            <Text style={styles.textoBotonGrande}>
                                NUEVA ENCUESTA
                            </Text>
                        </TouchableOpacity>
                    )}

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                            style={{ marginTop: 50 }}
                        />
                    ) : surveys && surveys.length > 0 ? (
                        <View style={styles.contenedorListado}>
                            <View style={styles.gridEncuestas}>
                                {surveys.map((item) => (
                                    <View
                                        key={item.id}
                                        style={styles.cajaEncuestas}
                                    >
                                        <View>
                                            <Text
                                                numberOfLines={2}
                                                style={styles.tittleTextSurvey}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text style={styles.textoEstado}>
                                                {"Estado: "}
                                                <Text
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: item.status
                                                            ? "#22C55E"
                                                            : "#EAB308",
                                                    }}
                                                >
                                                    {item.status ? "ACTIVA" : "BORRADOR"}
                                                </Text>
                                            </Text>
                                        </View>
                                        {renderActionButtons(item)}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: 100, alignItems: "center" }}>
                            <Ionicons
                                name="document-text-outline"
                                size={60}
                                color="#333"
                            />
                            <Text
                                style={{
                                    color: "#666",
                                    marginTop: 15,
                                    fontSize: 16,
                                }}
                            >
                                No hay encuestas registradas.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </ResponsiveLayout>

            <MenuPrincipal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                navigation={navigation}
            />
        </SafeAreaView>
    );
}