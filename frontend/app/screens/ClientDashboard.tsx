import React, { useEffect, useState, useCallback } from "react";
import { 
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
    RefreshControl, SafeAreaView, StatusBar, Platform   // ← añadido Platform
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

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user, token } = useAuth(); // Extraemos token para la petición
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

    // Función para asignar masivamente
    const handleAssignToUsers = async (surveyId: number, numUsers: number) => {
        if (!surveyId) return;
        
        setAssigningId(surveyId);
        try {
            // Asumimos que el endpoint es /api/auth2/assign-survey (ajusta según tu Controller)
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
                fetchMySurveys(); // Recargamos para ver si numUsers cambió
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
                    {/* BOTÓN ASIGNAR */}
                    <TouchableOpacity 
                        style={[styles.botonResultados, { borderColor: colors.blue, backgroundColor: 'rgba(74, 144, 226, 0.1)' }]}
                        onPress={() => {
                            if (item.id !== undefined) {
                                handleAssignToUsers(item.id, item.numUsers || 0);
                            } else {
                                console.warn("No se puede asignar: El ID de la encuesta no existe.");
                            }
                        }}
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

                    {/* BOTÓN ANÁLISIS */}
                    <TouchableOpacity 
                        style={styles.botonResultados}
                        onPress={() => {
                            if (item.supersetID) {
                                navigation.navigate("SurveyAnalytics", { supersetID: item.supersetID, title: item.name });
                            } else {
                                Alert.alert("Aviso", "Esta encuesta no tiene un dashboard vinculado.");
                            }
                        }}
                    >
                        <MaterialCommunityIcons name="chart-box-outline" size={18} color={colors.primary} />
                        <Text style={styles.textoBotonResultados}>ANÁLISIS</Text>
                    </TouchableOpacity>
                </View>
    // --- FUNCIÓN DE RENDERIZADO PARA ANDROID (Súper Estilizada) ---
    const renderSurveyItemAndroid = ({ item }: { item: Survey }) => (
        <TouchableOpacity 
            activeOpacity={0.8}
            style={styles.cajaEncuestasAndroid}
            onPress={() => console.log("Click en", item.name)}
        >
            <View style={styles.iconContainerAndroid}>
                <Ionicons name="document-text" size={22} color={colors.secondary} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={[styles.tittleTextSurvey, { fontSize: 17, marginBottom: 4 }]}>
                    {item.name}
                </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: colors.textMain, opacity: 0.5, fontSize: 12 }}>
                        {item.numQuestions} Qs
                    </Text>
                    <View style={styles.dot} />
                    <View style={styles.badgeAndroid}>
                        <Text style={{ color: colors.cta, fontSize: 10, fontWeight: '700' }}>
                            {item.numUsers || 0} RESPUESTAS
                        </Text>
                    </View>
                </View>
            </View>
        </View>

            <Ionicons name="chevron-forward-outline" size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>
    );

    // --- RENDER WEB ---
    if (isWeb) {
        return (
            <ResponsiveLayout fullWidth={true}>
                <View style={{ padding: 20 }}>
                     <Text style={styles.tituloHero}>Panel Web</Text>
                </View>
            </ResponsiveLayout>
        );
    }

    // --- RENDER ANDROID CON LOS CAMBIOS MÍNIMOS ---
    return (
        <View style={styles.alineadoPersonal}>
            <ResponsiveLayout fullWidth={true}>
                <View style={{ padding: isDesktopView ? 40 : 20, width: '100%' }}>
                    
                    <View style={{ 
                        width: '100%', 
                        marginBottom: 30, 
                        flexDirection: isDesktopView ? 'row' : 'column', 
                        justifyContent: 'space-between', 
                        alignItems: isDesktopView ? 'center' : 'flex-start',
                        gap: 20
                    }}>
                        <View>
                            <Text style={[styles.tituloHero, { textAlign: 'left' }]}>
                                Panel de <Text style={styles.destaqueAzul}>Empresa</Text>
                            </Text>
                            <Text style={{ color: colors.textSecondary, marginTop: 5, fontSize: 16 }}>
                                Gestiona tus encuestas y lanza campañas masivas.
                            </Text>
                        </View>
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Header */}
                <View style={styles.headerAndroid}>
                    <Text style={styles.saludoAndroid}>Hola, {user?.name}</Text>
                    <Text style={[styles.tituloHero, { textAlign: 'left', fontSize: 32 }]}>
                        Mis <Text style={styles.destaqueAzul}>Proyectos</Text>
                    </Text>
                </View>

                        <View style={{ width: isDesktopView ? 240 : '100%' }}>
                            <CustomButton 
                                title="+ NUEVO PROYECTO" 
                                onPress={() => navigation.navigate("SurveyCreator")} 
                            />
                        </View>
                    </View>
                {/* Stats */}
                <View style={styles.containerStats}>
                    <View style={styles.cardStat}>
                        <Text style={styles.statNumber}>{surveys.length}</Text>
                        <Text style={styles.statLabel}>Activos</Text>
                    </View>
                    <View style={styles.cardStat}>
                        <Text style={[styles.statNumber, { color: colors.cta }]}>
                            {surveys.reduce((acc, curr) => acc + (curr.numUsers || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Respuestas</Text>
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
                                scrollEnabled={Platform.OS === 'web' ? false : true}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                                }
                                ListEmptyComponent={
                                    <View style={{ marginTop: 60, alignItems: 'center', opacity: 0.5 }}>
                                        <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} />
                                        <Text style={{ color: colors.textSecondary, marginTop: 15, fontSize: 16 }}>
                                            No hay proyectos registrados todavía.
                                        </Text>
                                    </View>
                                }
                                contentContainerStyle={{ paddingBottom: 40 }}
                            />
                        )}
                    </View>
                </View>
            </ResponsiveLayout>
        </View>
                {/* Lista */}
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={surveys}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />
                        }
                        renderItem={renderSurveyItemAndroid}
                        contentContainerStyle={{ paddingBottom: 100 }}  // ← cambiado de 120 a 100
                        keyboardShouldPersistTaps="handled"             // ← nuevo
                        removeClippedSubviews={Platform.OS === 'android'} // ← nuevo
                        maxToRenderPerBatch={10}                        // ← nuevo
                    />
                )}
            </View>

            {/* Botón Flotante */}
            <View style={styles.floatingBtnContainer}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("SurveyCreator")}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add" size={35} color="#1D2735" />
                </TouchableOpacity>
            </View>
        </View>
    );
}