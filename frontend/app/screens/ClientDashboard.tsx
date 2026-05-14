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

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user, token } = useAuth();
    const { isDesktopView } = useLayout();
    
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    // Definición de fuente neutral
    const neutralFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';

    const fetchMySurveys = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
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
                Alert.alert("Éxito", `Encuesta asignada correctamente.`);
                fetchMySurveys();
            } else {
                Alert.alert("Error", "No se pudo realizar la asignación masiva.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Error de conexión.");
        } finally {
            setAssigningId(null);
        }
    };

    // ------------------------------------------------------------
    // VERSIÓN WEB
    // ------------------------------------------------------------
    if (isWeb) {
        const renderSurveyItem = ({ item }: { item: Survey }) => (
            <View style={[styles.cajaEncuestas, { backgroundColor: '#161616', borderRadius: 16 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, paddingRight: 15 }}>
                        <Text style={[styles.tittleTextSurvey, { fontFamily: neutralFont, fontWeight: '700' }]}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="list" size={14} color={colors.primary} />
                                <Text style={{ color: colors.textSecondary, fontSize: 13, fontFamily: neutralFont }}>{item.numQuestions} Qs</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Ionicons name="people" size={14} color={colors.primary} />
                                <Text style={{ color: colors.textSecondary, fontSize: 13, fontFamily: neutralFont }}>{item.numUsers || 0} objetivo</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: isDesktopView ? 'row' : 'column', gap: 10 }}>
                        <TouchableOpacity 
                            style={[styles.botonResultados, { borderColor: colors.secondary, backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}
                            onPress={() => { if (item.id !== undefined) handleAssignToUsers(item.id, item.numUsers || 0); }}
                            disabled={assigningId === item.id}
                        >
                            {assigningId === item.id ? (
                                <ActivityIndicator size="small" color={colors.secondary} />
                            ) : (
                                <>
                                    <Ionicons name="person-add-outline" size={18} color={colors.secondary} />
                                    <Text style={[styles.textoBotonResultados, { color: colors.secondary, fontFamily: neutralFont, fontWeight: '600' }]}>ASIGNAR</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.botonResultados}
                            onPress={() => {
                                if (item.supersetID) navigation.navigate("SurveyAnalytics", { supersetID: item.supersetID, title: item.name });
                                else Alert.alert("Aviso", "Sin dashboard vinculado.");
                            }}
                        >
                            <MaterialCommunityIcons name="chart-box-outline" size={18} color={colors.primary} />
                            <Text style={[styles.textoBotonResultados, { fontFamily: neutralFont, fontWeight: '600' }]}>ANÁLISIS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

return (
    <View style={[styles.alineadoPersonal, { backgroundColor: '#0e0d0df1' }]}>
        <ResponsiveLayout fullWidth={true}>
            <View style={{ padding: isDesktopView ? 40 : 20, width: '100%' }}>
                
                {/* CABECERA MEJORADA */}
                <View style={{ 
                    width: '100%', 
                    marginBottom: 40, 
                    flexDirection: isDesktopView ? 'row' : 'column', 
                    justifyContent: 'space-between', 
                    alignItems: isDesktopView ? 'center' : 'flex-start', 
                    gap: 20 
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.tituloHero, { textAlign: 'left', fontFamily: neutralFont, fontWeight: '900', letterSpacing: -1 }]}>
                            Panel de <Text style={styles.destaqueAzul}>Empresa</Text>
                        </Text>
                        <Text style={{ 
                            color: colors.textSecondary, 
                            marginTop: 8, 
                            fontSize: 18, 
                            fontFamily: neutralFont,
                            opacity: 0.8 
                        }}>
                            Lanza tu próxima campaña y <Text style={{ color: colors.primary, fontWeight: '600' }}>conquista el mercado gaming.</Text>
                        </Text>
                    </View>

                    {/* BOTÓN "NUEVA ENCUESTA" CORREGIDO */}
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("SurveyCreator")}
                        activeOpacity={0.7}
                        style={{ 
                            width: isDesktopView ? 260 : '100%',
                            backgroundColor: colors.primary,
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            // Efecto de brillo sutil para Web
                            boxShadow: '0 4px 15px rgba(91, 85, 192, 0.4)'
                        } as any}
                    >
                        <Ionicons name="game-controller" size={22} color="white" />
                        <Text style={{ 
                            color: 'white', 
                            fontSize: 15, 
                            fontWeight: '800', 
                            fontFamily: neutralFont,
                            letterSpacing: 0.5
                        }}>
                            DISEÑAR QUEST
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* PROYECTOS ACTIVOS */}
                <View style={{ width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                        <MaterialCommunityIcons name="view-grid-outline" size={22} color={colors.primary} style={{ marginRight: 10 }} />
                        <Text style={[styles.mainText, { fontFamily: neutralFont, fontWeight: '700', fontSize: 24 }]}>
                            Proyectos Activos
                        </Text>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                    ) : (
                        <FlatList
                            data={surveys}
                            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                            renderItem={renderSurveyItem}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <View style={{ marginTop: 60, alignItems: 'center', opacity: 0.5 }}>
                                    <Ionicons name="terminal-outline" size={60} color={colors.textSecondary} />
                                    <Text style={{ color: colors.textSecondary, marginTop: 15, fontSize: 16, fontFamily: neutralFont }}>
                                        No hay misiones activas en el radar.
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </ResponsiveLayout>
    </View>
);
    }

    // ------------------------------------------------------------
    // VERSIÓN MOBILE
    // ------------------------------------------------------------
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0e0d0df1' }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 28, fontWeight: '900', color: colors.white, fontFamily: neutralFont }}>Hola, {user?.name}</Text>
                        <Text style={{ fontSize: 16, color: colors.textSecondary, marginTop: 4, fontFamily: neutralFont }}>Panel de Gestión</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate("SurveyCreator")}
                        activeOpacity={0.8}
                        style={{ 
                            backgroundColor: colors.primary, 
                            paddingVertical: 18, 
                            borderRadius: 20, 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: 24,
                            gap: 12,
                            elevation: 4,
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8
                        }}
                    >
                        <Ionicons name="add-circle" size={26} color="white" />
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', fontFamily: neutralFont, letterSpacing: 0.5 }}>CREAR NUEVA ENCUESTA</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                        <View style={{ flex: 1, backgroundColor: '#161616', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' }}>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.primary, fontFamily: neutralFont }}>{surveys.length}</Text>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: neutralFont }}>Proyectos</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: '#161616', borderRadius: 24, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' }}>
                            <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.secondary, fontFamily: neutralFont }}>
                                {surveys.reduce((sum, s) => sum + (s.numUsers || 0), 0)}
                            </Text>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: neutralFont }}>Objetivo Total</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: '800', color: colors.white, marginBottom: 16, fontFamily: neutralFont }}>Mis Proyectos</Text>
                    
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
                    ) : surveys.length === 0 ? (
                        <View style={{ marginTop: 60, alignItems: 'center', opacity: 0.4 }}>
                            <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 15, fontSize: 16, fontFamily: neutralFont }}>No hay proyectos registrados</Text>
                        </View>
                    ) : (
                        surveys.map((item) => (
                            <View key={item.id} style={{ backgroundColor: '#161616', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.white, marginBottom: 10, fontFamily: neutralFont }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Ionicons name="list" size={16} color={colors.primary} />
                                        <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: neutralFont }}>{item.numQuestions} Qs</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Ionicons name="people" size={16} color={colors.primary} />
                                        <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: neutralFont }}>{item.numUsers || 0} objetivo</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TouchableOpacity 
                                        onPress={() => handleAssignToUsers(item.id!, item.numUsers || 0)}
                                        disabled={assigningId === item.id}
                                        style={{ flex: 1, backgroundColor: 'rgba(59,130,246,0.1)', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.secondary }}
                                    >
                                        {assigningId === item.id ? (
                                            <ActivityIndicator size="small" color={colors.secondary} />
                                        ) : (
                                            <Text style={{ color: colors.secondary, fontWeight: '700', fontFamily: neutralFont }}>ASIGNAR</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => item.supersetID ? navigation.navigate("SurveyAnalytics", { supersetID: item.supersetID, title: item.name }) : Alert.alert("Aviso", "Sin dashboard")}
                                        style={{ flex: 1, backgroundColor: 'rgba(91,85,192,0.1)', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.primary }}
                                    >
                                        <Text style={{ color: colors.primary, fontWeight: '700', fontFamily: neutralFont }}>ANÁLISIS</Text>
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