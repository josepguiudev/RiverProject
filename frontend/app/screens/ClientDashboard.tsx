import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // O la librería de iconos que uses

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
    const { user } = useAuth();
    const { isDesktopView } = useLayout();
    
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Cargar encuestas del cliente
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

    // Recargar cada vez que la pantalla gana el foco (por si vuelve de crear una)
    useFocusEffect(
        useCallback(() => {
            fetchMySurveys();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMySurveys();
    };
    const renderSurveyItemMobile = ({ item }: { item: Survey }) => (
        <TouchableOpacity 
            style={[styles.cajaEncuestas, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }]}
            onPress={() => {/* Aquí podrías ir a ver estadísticas detalladas */}}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.tittleTextSurvey}>{item.name}</Text>
                <Text style={[styles.texto, { fontSize: 12, opacity: 0.7, marginTop: 5 }]}>
                    Preguntas: {item.numQuestions} | Respuestas: {item.numUsers || 0}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors?.primary || '#8CD329'} />
        </TouchableOpacity>
    );

    const renderSurveyItem = ({ item }: { item: Survey }) => (
        <TouchableOpacity 
            style={[styles.cajaEncuestas, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
            onPress={() => {/* Aquí podrías ir a ver estadísticas detalladas */}}
        >
            <View style={{ flex: 1 }}>
                <Text style={styles.tittleTextSurvey}>{item.name}</Text>
                <Text style={[styles.texto, { fontSize: 12, opacity: 0.7 }]}>
                    Preguntas: {item.numQuestions} | Respuestas: {item.numUsers || 0}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
    );

    if(isWeb){
        return (
        <ResponsiveLayout fullWidth={true}>
            {/* Header del Dashboard */}
            <View style={{ width: '100%', marginBottom: 25, flexDirection: isDesktopView ? 'row' : 'column', justifyContent: 'space-between', alignItems: isDesktopView ? 'center' : 'flex-start' }}>
                <View>
                    <Text style={[styles.tituloHero, { fontSize: 28, textAlign: 'left' }]}>
                        Panel de <Text style={styles.destaqueAzul}>Empresa</Text>
                    </Text>
                    <Text style={[styles.texto, { textAlign: 'left' }]}>Bienvenido, {user?.name || 'Cliente'}</Text>
                </View>

                <View style={{ width: isDesktopView ? 250 : '100%', marginTop: isDesktopView ? 0 : 20 }}>
                    <CustomButton 
                        title="+ NUEVO PROYECTO" 
                        onPress={() => navigation.navigate("SurveyCreator")} 
                    />
                </View>
            </View>

            <View style={{ flex: 1, width: '100%' }}>
                <Text style={[styles.mainText, { fontSize: 18, marginBottom: 15, color: colors.secondary }]}>
                    Tus Proyectos Activos
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={surveys}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={renderSurveyItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                        }
                        ListEmptyComponent={
                            <View style={{ marginTop: 100, alignItems: 'center' }}>
                                <Ionicons name="document-text-outline" size={80} color="#333" />
                                <Text style={[styles.texto, { marginTop: 15, opacity: 0.5 }]}>
                                    Aún no has creado ninguna encuesta.
                                </Text>
                            </View>
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </ResponsiveLayout>
    );
    }else{
        // Quitamos <ResponsiveLayout> de aquí porque seguramente tiene un ScrollView
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#0e0d0df1' }}>
                <View style={{ flex: 1, padding: 20 }}>
                    
                    {/* Header Móvil */}
                    <View style={{ width: '100%', marginBottom: 25, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={[styles.tituloHero, { fontSize: 28, textAlign: 'left', color: '#fff' }]}>
                                Panel de <Text style={styles.destaqueAzul}>Empresa</Text>
                            </Text>
                            <Text style={[styles.texto, { textAlign: 'left', marginTop: 5, color: '#DCDEDF' }]}>Bienvenido, {user?.name || 'Cliente'}</Text>
                        </View>

                        <View style={{ width: '100%', marginTop: 20 }}>
                            <CustomButton 
                                title="+ NUEVO PROYECTO" 
                                onPress={() => navigation.navigate("SurveyCreator")} 
                            />
                        </View>
                    </View>

                    {/* Lista Móvil */}
                    <View style={{ flex: 1, width: '100%' }}>
                        <Text style={[styles.mainText, { fontSize: 18, marginBottom: 15, color: colors?.secondary || '#fff' }]}>
                            Tus Proyectos Activos
                        </Text>

                        {loading ? (
                            <ActivityIndicator size="large" color={colors?.primary || '#8CD329'} style={{ marginTop: 50 }} />
                        ) : (
                            <FlatList
                                data={surveys}
                                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                                renderItem={renderSurveyItemMobile}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors?.primary || '#8CD329'} />
                                }
                                ListEmptyComponent={
                                    <View style={{ marginTop: 100, alignItems: 'center' }}>
                                        <Ionicons name="document-text-outline" size={80} color="#546E7A" />
                                        <Text style={[styles.texto, { marginTop: 15, color: '#DCDEDF', opacity: 0.7 }]}>
                                            Aún no has creado ninguna encuesta.
                                        </Text>
                                    </View>
                                }
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        );
    }
    
}