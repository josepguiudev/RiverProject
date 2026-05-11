import React, { useEffect, useState, useCallback } from "react";
import { 
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
    RefreshControl, SafeAreaView, StatusBar, Platform   // ← añadido Platform
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 

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
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMySurveys();
    };

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