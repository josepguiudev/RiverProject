import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, Alert, RefreshControl, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons"; 

import { FormApiService } from '../services/api/service';
import { UserSurveyRel } from '../types/formsSurvey.types';
import { useAuth } from "../screens/Auth/AuthContext";
import { useLayout } from '@/app/utils/useLayout';
import stylesGlobal, { colors } from '../screens/stylesGlobal';
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
                                    </View>
                                    <Ionicons name={isCompleted ? "checkmark-done" : "chevron-forward"} size={22} color={isCompleted ? colors.cta : colors.secondary} />
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSurveys} tintColor={colors.secondary} />}
                    />
                </View>
                <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
            </SafeAreaView>
        );
    }

    // --- VISTA WEB / DESKTOP ---
    return (
        <SafeAreaView style={stylesGlobal.alineadoPersonal}>
            <View style={[stylesGlobal.contenedorListado, isDesktopView && { marginTop: 60 }]}>
                <View style={{ marginBottom: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[stylesGlobal.tituloHero, isDesktopView && stylesGlobal.tituloHeroDesktop, { textAlign: 'left' }]}>
                        Mis <Text style={stylesGlobal.destaqueAzul}>Encuestas</Text>
                    </Text>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={stylesGlobal.iconContainerAndroid}>
                        <Ionicons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={surveys}
                    numColumns={isDesktopView ? 2 : 1}
                    key={isDesktopView ? 'h' : 'v'}
                    keyExtractor={(item) => item?.survey?.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => {
                        const isCompleted = Number(item.isRespondida) === 1;
                        return (
                            <TouchableOpacity 
                                style={[
                                    stylesGlobal.cajaEncuestas, 
                                    isCompleted && stylesGlobal.cajaEncuestasCompletada,
                                    isDesktopView && { width: '48%', marginHorizontal: '1%' }
                                ]}
                            >
                                <Text style={[stylesGlobal.tittleTextSurvey, isDesktopView && stylesGlobal.tittleTextSurveyDesktop]}>
                                    {item.survey.name}
                                </Text>
                                <Text style={stylesGlobal.textoEstado}>
                                    {isCompleted ? "Estado: Completada" : "Estado: Pendiente"}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSurveys} />}
                />
            </View>
            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </SafeAreaView>
    );
};

export default SurveyListScreen;