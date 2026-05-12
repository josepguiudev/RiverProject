import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Platform, Alert, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 

import { FormApiService } from "../services/api/service";
import { useAuth } from "./Auth/AuthContext";
import { useLayout } from "@/app/utils/useLayout";
import { Survey } from "../types/formsSurvey.types";
import styles, { colors } from "./stylesGlobal";
import CustomButton from "../components/CustomButton/CustomButton";
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "@/assets/supportFiles/strings.json";

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user, token } = useAuth(); 
    const { isDesktopView } = useLayout();
    
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

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
                        onPress={() => {
                            if (item.id !== undefined) {
                                handleAssignToUsers(item.id, item.numUsers || 0);
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
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={[styles.scrollContainer, { paddingVertical: 40 }]}
            >
                {/* BOTÓN MENU ESTANDARIZADO */}
                <View style={{ 
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? 50 : 20,
                    left: 20,
                    zIndex: 10,
                }}>
                    <TouchableOpacity 
                        onPress={() => setMenuVisible(true)} 
                        style={{ 
                            padding: 10, 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu || "MENÚ"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', maxWidth: 1000, alignSelf: 'center', paddingHorizontal: 20 }}>
                    
                    <View style={{ 
                        width: '100%', 
                        marginBottom: 40, 
                        flexDirection: isDesktopView ? 'row' : 'column', 
                        justifyContent: 'space-between', 
                        alignItems: isDesktopView ? 'center' : 'flex-start',
                        gap: 20,
                        marginTop: 40 // Espacio para el botón de menú
                    }}>
                        <View>
                            <Text style={[styles.tituloHero, { textAlign: 'left' }]}>
                                Panel de <Text style={styles.destaqueAzul}>Empresa</Text>
                            </Text>
                            <Text style={{ color: colors.textSecondary, marginTop: 5, fontSize: 16 }}>
                                Gestiona tus encuestas y lanza campañas masivas.
                            </Text>
                        </View>

                        <View style={{ width: isDesktopView ? 350 : '100%', alignItems: 'center' }}>
                            <CustomButton 
                                title="NUEVO PROYECTO" 
                                onPress={() => navigation.navigate("SurveyCreator")} 
                            />
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
            </ScrollView>
            
            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}