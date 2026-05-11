import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { View, FlatList, Text, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons"; 

import { FormApiService } from '../services/api/service';
import { UserSurveyRel } from '../types/formsSurvey.types';
import { useAuth } from "../screens/Auth/AuthContext";
import { useLayout } from '@/app/utils/useLayout';
import stylesGlobal, { colors } from './stylesGlobal';
import globalStyles from "@/assets/globalStyles/globalStyles";
import strings from "../../../frontend/assets/supportFiles/strings.json";
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import { isWeb } from "@/app/utils/device";

const SurveyListScreen = ({ navigation }: any) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const { isDesktopView } = useLayout();
    const { user, loading: authLoading } = useAuth();
    
    const [surveys, setSurveys] = useState<UserSurveyRel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Lógica de datos (compartida)
    const totalPendientes = surveys.filter(s => Number(s.isRespondida) === 0).length;
    const totalCompletadas = surveys.filter(s => Number(s.isRespondida) === 1).length;

    const loadSurveys = async () => {
        if (!user?.id) return;
        try {
            const data = await FormApiService.getUserSurveys(Number(user.id));
            setSurveys(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Error cargando encuestas:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!authLoading && user?.id) loadSurveys();
        }, [user, authLoading])
    );

    if (authLoading || (loading && !refreshing)) return (
        <View style={stylesGlobal.alineadoPersonal}>
            <ActivityIndicator size="large" color={colors.secondary} />
        </View>
    );

    // --- VISTA ANDROID / MOBILE ---
    if (!isWeb) {
        return (
            <SafeAreaView style={stylesGlobal.alineadoPersonal}>
                <StatusBar barStyle="light-content" />
                
                {/* Header Android: Menú y Perfil */}
                <View style={[stylesGlobal.row, { justifyContent: 'space-between', padding: 25, width: '100%' }]}>
                    <TouchableOpacity 
                        onPress={() => setMenuVisible(true)} 
                        style={stylesGlobal.iconContainerAndroid}
                    >
                        <Ionicons name="menu-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[stylesGlobal.texto, { fontWeight: 'bold', color: colors.secondary }]}>{user?.name}</Text>
                        <Text style={stylesGlobal.statLabel}>ID: #{user?.id}</Text>
                    </View>
                </View>
    return (
        <View style={stylesGlobal.alineadoPersonal}>
            {/* 1. HEADER / BOTÓN MENU - Fijo arriba */}
            <View style={{ 
                width: '100%', 
                flexDirection: 'row', 
                justifyContent: 'flex-start', 
                zIndex: 10,
                paddingTop: Platform.OS === 'ios' ? 50 : 20, // Margen para notch en iOS
                paddingHorizontal: 20 
            }}>
                <TouchableOpacity 
                    onPress={() => setMenuVisible(true)} 
                    style={{ 
                        padding: 10, 
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        borderRadius: 8 
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

                <View style={{ flex: 1, width: '100%', paddingHorizontal: 25 }}>
                    <View style={stylesGlobal.headerAndroid}>
                        <Text style={[stylesGlobal.tituloHero, { textAlign: 'left' }]}>
                            Mis <Text style={stylesGlobal.destaqueAzul}>Encuestas</Text>
                        </Text>
                        
                        {/* Chips de conteo usando tus badges */}
                        <View style={[stylesGlobal.row, { justifyContent: 'flex-start', marginTop: 15, gap: 10 }]}>
                            <View style={stylesGlobal.badgeAndroid}>
                                <Text style={{ color: colors.secondary, fontSize: 11, fontWeight: 'bold' }}>{totalPendientes} PENDIENTES</Text>
                            </View>
                            <View style={[stylesGlobal.badgeAndroid, { borderColor: 'rgba(139, 195, 74, 0.4)' }]}>
                                <Text style={{ color: colors.cta, fontSize: 11, fontWeight: 'bold' }}>{totalCompletadas} LISTAS</Text>
                            </View>
                        </View>
                    </View>

                    <FlatList
                        data={surveys}
                        keyExtractor={(item) => item?.survey?.id?.toString() || Math.random().toString()}
                        renderItem={({ item }) => {
                            const isCompleted = Number(item.isRespondida) === 1;
                            return (
                                <TouchableOpacity 
                                    onPress={() => !isCompleted && navigation.navigate('TakeSurvey', { surveyId: item.survey.id })}
                                    style={[
                                        stylesGlobal.cajaEncuestasAndroid,
                                        isCompleted && stylesGlobal.cajaEncuestasCompletada,
                                        { borderLeftWidth: 4, borderLeftColor: isCompleted ? colors.cta : colors.secondary }
                                    ]}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={stylesGlobal.tittleTextSurvey}>{item.survey.name}</Text>
                                        <View style={[stylesGlobal.row, { justifyContent: 'flex-start', marginTop: 5 }]}>
                                            <Text style={[stylesGlobal.textoEstado, { color: isCompleted ? colors.cta : colors.secondary, marginTop: 0 }]}>
                                                {isCompleted ? "Completada" : "Pendiente"}
                                            </Text>
                                            <View style={stylesGlobal.dot} />
                                            <Text style={[stylesGlobal.statLabel, { marginTop: 0 }]}>{item.survey.numQuestions} Qs</Text>
                                        </View>
            {/* 2. LISTADO DE ENCUESTAS */}
            <FlatList
                data={surveys}
                // KeyExtractor robusto para evitar avisos de duplicados
                keyExtractor={(item, index) => 
                    item?.id?.toString() || 
                    item?.survey?.id?.toString() || 
                    `survey-${index}`
                }
                // Estilo del contenedor de la lista para que se centre en Web
                contentContainerStyle={{ 
                    alignItems: 'center', 
                    paddingBottom: 60,
                    width: '100%',
                    paddingHorizontal: 15
                }}
                // Título de la pantalla como cabecera de la lista (mejor para el scroll)
                ListHeaderComponent={
                    <View style={{ width: '100%', maxWidth: 800, marginVertical: 40 }}>
                        <Text style={[
                            stylesGlobal.tituloHero, 
                            isDesktopView && stylesGlobal.tituloHeroDesktop,
                            { textAlign: 'center' }
                        ]}>
                            Mis Encuestas
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    if (!item || !item.survey) return null;

                    const isCompleted = Number(item.isRespondida) === 1;

                    return (
                        <View style={{ width: '100%', maxWidth: 800 }}>
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                disabled={isCompleted}
                                onPress={() => navigation.navigate('TakeSurvey', { surveyId: item.survey.id })}
                                style={[
                                    stylesGlobal.cajaEncuestas,
                                    { 
                                        flexDirection: 'row', 
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: isDesktopView ? 30 : 20,
                                        backgroundColor: isCompleted ? '#0a0a0a' : '#141414',
                                        borderColor: isCompleted ? '#28a745' : '#333',
                                        borderWidth: 1.5,
                                        opacity: isCompleted ? 0.7 : 1,
                                        marginBottom: 15
                                    }
                                ]}
                            >
                                {/* Lado izquierdo: Indicador y Textos */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    {/* Círculo de estado */}
                                    <View style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: 7,
                                        backgroundColor: isCompleted ? '#28a745' : '#fd7e14',
                                        marginRight: 15,
                                    }} />

                                    <View style={{ flex: 1 }}>
                                        <Text style={[
                                            stylesGlobal.tittleTextSurvey, 
                                            isDesktopView && stylesGlobal.tittleTextSurveyDesktop,
                                            isCompleted && { color: '#666' }
                                        ]}>
                                            {item.survey.name || "Encuesta sin nombre"}
                                        </Text>
                                        
                                        <Text style={{ 
                                            fontSize: 14, 
                                            color: isCompleted ? '#28a745' : '#888', 
                                            marginTop: 4,
                                            fontWeight: isCompleted ? 'bold' : 'normal'
                                        }}>
                                            {isCompleted ? "Completada ✓" : `Pendiente • ${item.survey.numQuestions || 0} preguntas`}
                                        </Text>
                                    </View>
                                    <Ionicons name={isCompleted ? "checkmark-done" : "chevron-forward"} size={22} color={isCompleted ? colors.cta : colors.secondary} />
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSurveys} tintColor={colors.secondary} />}
                                </View>

                                {/* Lado derecho: Badge de acción */}
                                <View style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 12,
                                    borderRadius: 6,
                                    backgroundColor: isCompleted ? 'rgba(40,167,69,0.1)' : 'rgba(91, 85, 192, 0.1)',
                                    borderWidth: 1,
                                    borderColor: isCompleted ? '#28a745' : '#5b55c0',
                                    marginLeft: 10
                                }}>
                                    <Text style={{ 
                                        color: isCompleted ? '#28a745' : '#5b55c0', 
                                        fontWeight: 'bold', 
                                        fontSize: 10 
                                    }}>
                                        {isCompleted ? "FINALIZADA" : "RESPONDER"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                }}
                // Control de actualización (pull to refresh)
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={loadSurveys} 
                        tintColor={colors.primary} 
                    />
                </View>
                <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
            </SafeAreaView>
        );
    }
                }
                // Mensaje si no hay encuestas
                ListEmptyComponent={
                    <View style={{ marginTop: 50 }}>
                        <Text style={[stylesGlobal.texto, { opacity: 0.5 }]}>No tienes encuestas asignadas por ahora.</Text>
                    </View>
                }
            />

            {/* 3. MENÚ LATERAL / OVERLAY */}
            <MenuPrincipal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
            />
        </View>
    );
};

export default SurveyListScreen;