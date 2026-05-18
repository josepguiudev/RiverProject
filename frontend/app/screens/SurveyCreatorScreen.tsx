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
import React, { useState, useCallback } from "react";
import { 
    View, Text, TouchableOpacity, ActivityIndicator, 
    Alert, SafeAreaView, ScrollView, Platform 
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
import { useAuth } from "./Auth/AuthContext";
import { isWeb } from "../utils/device";

// Importación del menú lateral
import MenuPrincipal from '@/app/components/Menu/CustomMenu';

export default function ClientDashboard() {
    const navigation = useNavigation<any>();
    const { user, logout } = useAuth(); 
    const { isDesktopView } = useLayout();
    
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    
    // Estado para controlar la visibilidad del menú
    const [menuVisible, setMenuVisible] = useState(false);

    const isAdmin = user?.role === 'ADMIN';
    const neutralFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';

    const fetchSurveys = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const data = await FormApiService.getSurveysByClient(user.id);
            setSurveys(data);
        } catch (error) {
            console.error("Error al cargar proyectos:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSurveys();
        }, [user?.id])
    );

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            const confirmLogout = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
            if (confirmLogout) logout();
        } else {
            Alert.alert(
                "Cerrar Sesión",
                "¿Estás seguro de que quieres salir?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Salir", style: "destructive", onPress: () => logout() }
                ]
            );
        }
    };

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
            const response = await client.post(`/api/auth2/assign-survey/${surveyId}?limit=${numUsers}`);
            if (response.status === 200) {
                Alert.alert("Éxito", `Encuesta asignada a ${numUsers} usuarios.`);
                fetchSurveys();
            }
        } catch (error) {
            Alert.alert("Error", "Error en la asignación.");
        } finally {
            setAssigningId(null);
        }
    };

    const renderActionButtons = (item: Survey) => {
        const isPublished = item.status === true;

        return (
            <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                gap: 12, 
                marginTop: 20,
                alignItems: 'center' 
            }}>
                <TouchableOpacity 
                    style={[styles.botonResultados, { minWidth: 120, paddingHorizontal: 15, height: 45 }]}
                    onPress={() => item.supersetID 
                        ? navigation.navigate("AdminGraphics", { supersetID: item.supersetID, title: item.name }) 
                        : Alert.alert("Aviso", "Sin dashboard vinculado.")
                    }
                >
                    <MaterialCommunityIcons name="chart-box-outline" size={20} color={colors.primary} />
                    <Text style={[styles.textoBotonResultados, { fontFamily: neutralFont, marginLeft: 8 }]}>ANÁLISIS</Text>
                </TouchableOpacity>

                {isAdmin ? (
                    <>
                        {!isPublished && (
                            <TouchableOpacity 
                                style={[styles.botonResultados, { borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.1)', minWidth: 120, height: 45 }]}
                                onPress={() => handlePublish(item.id!)}
                            >
                                <Ionicons name="rocket-outline" size={20} color="#22C55E" />
                                <Text style={[styles.textoBotonResultados, { color: '#22C55E', marginLeft: 8 }]}>PUBLICAR</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity 
                            style={[
                                styles.botonResultados, 
                                { borderColor: colors.secondary, backgroundColor: 'rgba(59, 130, 246, 0.1)', minWidth: 120, height: 45 }
                            ]}
                            onPress={() => handleAssignToUsers(item.id!, item.numUsers || 0)}
                            disabled={assigningId === item.id}
                        >
                            {assigningId === item.id ? (
                                <ActivityIndicator size="small" color={colors.secondary} />
                            ) : (
                                <>
                                    <Ionicons name="person-add-outline" size={20} color={colors.secondary} />
                                    <Text style={[styles.textoBotonResultados, { color: colors.secondary, fontWeight: '700', marginLeft: 8 }]}>ASIGNAR</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {!isPublished && (
                            <TouchableOpacity 
                                style={[styles.botonResultados, { borderColor: '#EAB308', backgroundColor: 'rgba(234, 179, 8, 0.1)', minWidth: 120, height: 45 }]}
                                onPress={() => navigation.navigate("SurveyCreator", { surveyEdit: item })}
                            >
                                <Ionicons name="create-outline" size={20} color="#EAB308" />
                                <Text style={[styles.textoBotonResultados, { color: '#EAB308', marginLeft: 8 }]}>EDITAR</Text>
                            </TouchableOpacity>
                        )}
                        
                        {isPublished && (
                            <View style={[styles.botonResultados, { borderColor: 'gray', opacity: 0.6, minWidth: 120, height: 45 }]}>
                                <Ionicons name="checkmark-circle-outline" size={20} color="gray" />
                                <Text style={[styles.textoBotonResultados, { color: 'gray', marginLeft: 8 }]}>ACTIVA</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.alineadoPersonal, { backgroundColor: colors.background, flex: 1 }]}>
            <ResponsiveLayout fullWidth={true}>
                <ScrollView contentContainerStyle={{ padding: isWeb ? 40 : 20 }}>
                    
                    {/* CABECERA CON BOTÓN HAMBURGUESA */}
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: 30 
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 }}>
                            {/* Botón para abrir el menú */}
                            <TouchableOpacity 
                                onPress={() => setMenuVisible(true)} 
                                style={{ padding: 8 }}
                            >
                                <Ionicons name="menu-outline" size={32} color="white" />
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}>
                                <Text style={[styles.tituloHero, { textAlign: 'left', marginBottom: 0 }]}>
                                    Panel de <Text style={styles.destaqueAzul}>{isAdmin ? "Administrador" : "Empresa"}</Text>
                                </Text>
                                <Text style={{ color: '#888', marginTop: 5, fontSize: 14 }}>
                                    {user?.email || 'Bienvenido'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={handleLogout}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 59, 48, 0.3)'
                            }}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                            {isDesktopView && (
                                <Text style={{ color: '#FF3B30', fontWeight: 'bold', marginLeft: 8, fontSize: 12 }}>
                                    CERRAR SESIÓN
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* NUEVA ENCUESTA */}
                    {!isAdmin && (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate("SurveyCreator")}
                            style={[styles.botonGrande, { flexDirection: 'row', gap: 10, marginBottom: 30 }]}
                        >
                            <Ionicons name="add-circle" size={24} color="white" />
                            <Text style={styles.textoBotonGrande}>NUEVA ENCUESTA</Text>
                        </TouchableOpacity>
                    )}

                    {/* LISTADO DE ENCUESTAS */}
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                    ) : (
                        surveys.length > 0 ? (
                            surveys.map((item) => (
                                <View key={item.id} style={[styles.cajaEncuestas, { padding: 25, marginBottom: 20 }]}>
                                    <Text style={[styles.tittleTextSurvey, { fontSize: 22 }]}>{item.name}</Text>
                                    <Text style={[styles.textoEstado, { marginTop: 8 }]}>
                                        Estado: <Text style={{ fontWeight: 'bold', color: item.status ? '#22C55E' : '#EAB308' }}>
                                            {item.status ? 'ACTIVA' : 'BORRADOR / PENDIENTE'}
                                        </Text>
                                    </Text>
                                    {renderActionButtons(item)}
                                </View>
                            ))
                        ) : (
                            <View style={{ marginTop: 100, alignItems: 'center' }}>
                                <Ionicons name="document-text-outline" size={60} color="#333" />
                                <Text style={{ color: '#666', marginTop: 15, fontSize: 16 }}>No hay encuestas registradas.</Text>
                            </View>
                        )
                    )}
                </ScrollView>
            </ResponsiveLayout>

            {/* MENÚ LATERAL: Situado fuera del ResponsiveLayout para renderizarse de forma independiente */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
                navigation={navigation} 
            />
        </SafeAreaView>
    );
}