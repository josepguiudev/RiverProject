import React, { useEffect, useState, useCallback } from "react";
import { 
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
    RefreshControl, Platform, Alert, SafeAreaView, ScrollView 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 

import { FormApiService } from "../services/api/service";
import { useAuth } from "./Auth/AuthContext";
import { useLayout } from "@/app/utils/useLayout";
import { Survey } from "../types/formsSurvey.types";
import styles, { colors } from "./stylesGlobal";
import { ResponsiveLayout } from "../components/ResponsiveLayout";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import { isWeb } from "../utils/device";
import stylesGlobal from "./stylesGlobal";

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user, token } = useAuth();
    const { isDesktopView } = useLayout();
    
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assigningId, setAssigningId] = useState<number | null>(null);

    const fetchMySurveys = async () => {
        if (!user?.id) return;
        try {
            const data = await FormApiService.getSurveysByClient(user.id);
            setSurveys(data);
        } catch (error) {
            console.error("Error al cargar proyectos:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMySurveys();
        }, [user?.id])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMySurveys();
    };

    const handleAssignToUsers = async (surveyId: number, numUsers: number) => {
        if (!surveyId) return;
        setAssigningId(surveyId);
        try {
            const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";
            const response = await fetch(`${baseUrl}/api/auth2/assign-survey/${surveyId}?limit=${numUsers}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                Alert.alert("Éxito", `Encuesta asignada correctamente a los usuarios.`);
                fetchMySurveys();
            } else {
                Alert.alert("Error", "No se pudo realizar la asignación masiva.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error de conexión con el servidor.");
        } finally {
            setAssigningId(null);
        }
    };

    // ------------------------------------------------------------
    // VERSIÓN WEB (original, sin cambios)
    // ------------------------------------------------------------
    if (isWeb) {
        const renderSurveyItem = ({ item }: { item: Survey }) => (
            <View style={styles.cajaEncuestas}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, paddingRight: 15 }}>
                        <Text style={styles.tittleTextSurvey}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="list" size={14} color={colors.primary} />
                                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.numQuestions} Qs</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="people" size={14} color={colors.primary} />
                                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.numUsers || 0} objetivo</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: isDesktopView ? 'row' : 'column', gap: 10 }}>
                        <TouchableOpacity 
                            style={[styles.botonResultados, { borderColor: colors.blue, backgroundColor: 'rgba(74, 144, 226, 0.1)' }]}
                            onPress={() => { if (item.id !== undefined) handleAssignToUsers(item.id, item.numUsers || 0); }}
                            disabled={assigningId === item.id}
                        >
                            {assigningId === item.id ? (
                                <ActivityIndicator size="small" color={colors.blue} />
                            ) : (
                                <>
                                    <Ionicons name="person-add-outline" size={18} color={colors.blue} />
                                    <Text style={[styles.textoBotonResultados, { color: colors.blue }]}>ASIGNAR</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.botonResultados}
                            onPress={() => {
                                if (item.supersetID) navigation.navigate("SurveyAnalytics", { supersetID: item.supersetID, title: item.name });
                                else Alert.alert("Aviso", "Esta encuesta no tiene un dashboard vinculado.");
                            }}
                        >
                            <MaterialCommunityIcons name="chart-box-outline" size={18} color={colors.primary} />
                            <Text style={styles.textoBotonResultados}>ANÁLISIS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

        return (
            <View style={styles.alineadoPersonal}>
                <ResponsiveLayout fullWidth={true}>
                    <View style={{ padding: isDesktopView ? 40 : 20, width: '100%' }}>
                        <View style={{ width: '100%', marginBottom: 30, flexDirection: isDesktopView ? 'row' : 'column', justifyContent: 'space-between', alignItems: isDesktopView ? 'center' : 'flex-start', gap: 20 }}>
                            <View>
                                <Text style={[styles.tituloHero, { textAlign: 'left' }]}>Panel de <Text style={styles.destaqueAzul}>Empresa</Text></Text>
                                <Text style={{ color: colors.textSecondary, marginTop: 5, fontSize: 16 }}>Gestiona tus encuestas y lanza campañas masivas.</Text>
                            </View>
                            <View style={{ width: isDesktopView ? 240 : '100%' }}>
                                <CustomButton title="+ NUEVO PROYECTO" onPress={() => navigation.navigate("SurveyCreator")} />
                            </View>
                        </View>
                        <View style={{ width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                <Ionicons name="stats-chart" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.mainText}>Proyectos Activos</Text>
                            </View>
                            {loading ? (
                                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                            ) : (
                                <FlatList
                                    data={surveys}
                                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                                    renderItem={renderSurveyItem}
                                    scrollEnabled={false}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                                    ListEmptyComponent={
                                        <View style={{ marginTop: 60, alignItems: 'center', opacity: 0.5 }}>
                                            <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
                                            <Text style={{ color: colors.textSecondary, marginTop: 15, fontSize: 16 }}>No hay proyectos registrados todavía.</Text>
                                        </View>
                                    }
                                    contentContainerStyle={{ paddingBottom: 40 }}
                                />
                            )}
                        </View>
                    </View>
                </ResponsiveLayout>
            </View>
        );
    }

    // ------------------------------------------------------------
    // VERSIÓN ANDROID (diseño táctil, apilado, grandes)
    // ------------------------------------------------------------
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    {/* Encabezado */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.white }}>Hola, {user?.name}</Text>
                        <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 4 }}>Panel de Empresa</Text>
                    </View>

                    {/* Botón nuevo proyecto (grande y destacado) */}
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("SurveyCreator")}
                        style={{ 
                            backgroundColor: colors.primary, 
                            paddingVertical: 16, 
                            borderRadius: 16, 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: 24,
                            gap: 10
                        }}
                    >
                        <Ionicons name="add-circle-outline" size={28} color="white" />
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>CREAR NUEVA ENCUESTA</Text>
                    </TouchableOpacity>

                    {/* Estadísticas rápidas */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                        <View style={{ flex: 1, backgroundColor: colors.darkCard, borderRadius: 20, padding: 16, alignItems: 'center' }}>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary }}>{surveys.length}</Text>
                            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Proyectos</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.darkCard, borderRadius: 20, padding: 16, alignItems: 'center' }}>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.cta }}>
                                {surveys.reduce((sum, s) => sum + (s.numUsers || 0), 0)}
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Respuestas</Text>
                        </View>
                    </View>

                    {/* Lista de encuestas */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 12 }}>Mis Proyectos</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                    ) : surveys.length === 0 ? (
                        <View style={{ marginTop: 60, alignItems: 'center', opacity: 0.5 }}>
                            <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 15, fontSize: 16 }}>No hay proyectos aún</Text>
                        </View>
                    ) : (
                        surveys.map((item) => (
                            <View key={item.id} style={{ backgroundColor: '#1A1A1A', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 8 }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Ionicons name="list" size={16} color={colors.primary} />
                                        <Text style={{ color: colors.textSecondary }}>{item.numQuestions} preguntas</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Ionicons name="people" size={16} color={colors.primary} />
                                        <Text style={{ color: colors.textSecondary }}>{item.numUsers || 0} objetivo</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TouchableOpacity 
                                        onPress={() => handleAssignToUsers(item.id!, item.numUsers || 0)}
                                        disabled={assigningId === item.id}
                                        style={{ flex: 1, backgroundColor: 'rgba(74,144,226,0.2)', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.blue }}
                                    >
                                        {assigningId === item.id ? (
                                            <ActivityIndicator size="small" color={colors.blue} />
                                        ) : (
                                            <Text style={{ color: colors.blue, fontWeight: 'bold' }}>ASIGNAR</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => item.supersetID ? navigation.navigate("SurveyAnalytics", { supersetID: item.supersetID, title: item.name }) : Alert.alert("Aviso", "Sin dashboard")}
                                        style={{ flex: 1, backgroundColor: 'rgba(91,85,192,0.2)', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.primary }}
                                    >
                                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>ANÁLISIS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}