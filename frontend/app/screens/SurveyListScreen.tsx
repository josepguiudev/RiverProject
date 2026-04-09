import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FormApiService } from '../services/api/service';
import { UserSurveyRel } from '../types/formsSurvey.types';
import { ResponsiveLayout } from '../components/ResponsiveLayout';
import { useAuth } from "../screens/Auth/AuthContext";
import { useLayout } from '@/app/utils/useLayout';
import stylesGlobal from './stylesGlobal';

const SurveyListScreen = ({ navigation }: any) => {
    const { isDesktopView } = useLayout();
    const { user, loading: authLoading } = useAuth();
    
    const [surveys, setSurveys] = useState<UserSurveyRel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadSurveys = async () => {
        if (!user?.id) return;
        try {
            const data = await FormApiService.getUserSurveys(Number(user.id));
            // Es buena práctica asegurar que data sea un array
            setSurveys(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Error cargando encuestas:", e);
            Alert.alert("Error", "No se han podido cargar las encuestas.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!authLoading && user?.id) {
                loadSurveys();
            }
        }, [user, authLoading])
    );

    if (authLoading || (loading && !refreshing)) return (
        <View style={stylesGlobal.alineadoPersonal}>
            <ActivityIndicator size="large" color="#5b55c0" />
        </View>
    );

    return (
        <ResponsiveLayout fullWidth={true}>
            <View style={{ flex: 1, width: '100%', alignItems: 'center', backgroundColor: '#000' }}>
                
                <View style={{ width: '100%', maxWidth: 1000, alignItems: 'center', marginTop: 50 }}>
                    <Text style={[
                        stylesGlobal.tituloHero, 
                        isDesktopView && stylesGlobal.tituloHeroDesktop,
                        { marginBottom: 40, fontSize: isDesktopView ? 60 : 40 }
                    ]}>
                        Mis Encuestas
                    </Text>
                </View>

                <View style={{ 
                    width: '100%', 
                    maxWidth: 900, 
                    paddingHorizontal: 20,
                    flex: 1 
                }}>
                    <FlatList
                        data={surveys}
                        // CORRECCIÓN AQUÍ: KeyExtractor robusto
                        keyExtractor={(item, index) => 
                            item?.id?.toString() || 
                            item?.survey?.id?.toString() || 
                            `survey-${index}`
                        }
                        contentContainerStyle={{ paddingBottom: 60 }}
                        renderItem={({ item }) => {
                            // VALIDACIÓN: Si no hay datos de encuesta, no renderizamos nada para evitar errores
                            if (!item || !item.survey) return null;

                            const isCompleted = Number(item.isRespondida) === 1;

                            return (
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
                                            padding: isDesktopView ? 35 : 20,
                                            backgroundColor: isCompleted ? '#0a0a0a' : '#141414',
                                            borderColor: isCompleted ? '#28a745' : '#333',
                                            borderWidth: 1.5,
                                            borderRadius: 15,
                                            marginBottom: 15,
                                            opacity: isCompleted ? 0.7 : 1
                                        }
                                    ]}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: 9,
                                            backgroundColor: isCompleted ? '#28a745' : '#fd7e14',
                                            marginRight: 20,
                                            shadowColor: isCompleted ? '#28a745' : '#fd7e14',
                                            shadowRadius: 8,
                                            shadowOpacity: 0.5,
                                            elevation: 5
                                        }} />

                                        <View style={{ flex: 1 }}>
                                            <Text style={[
                                                stylesGlobal.tittleTextSurvey, 
                                                { fontSize: isDesktopView ? 22 : 18 },
                                                isCompleted && { color: '#666' }
                                            ]}>
                                                {item.survey.name || "Encuesta sin nombre"}
                                            </Text>
                                            
                                            <Text style={{ 
                                                fontSize: 14, 
                                                color: isCompleted ? '#28a745' : '#888', 
                                                marginTop: 6,
                                                fontWeight: isCompleted ? 'bold' : 'normal'
                                            }}>
                                                {isCompleted ? "Completada ✓" : `Pendiente • ${item.survey.numQuestions || 0} preguntas`}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 15,
                                        borderRadius: 8,
                                        backgroundColor: isCompleted ? 'rgba(40,167,69,0.1)' : 'transparent',
                                        borderWidth: 1,
                                        borderColor: isCompleted ? '#28a745' : '#5b55c0'
                                    }}>
                                        <Text style={{ color: isCompleted ? '#28a745' : '#5b55c0', fontWeight: 'bold', fontSize: 11 }}>
                                            {isCompleted ? "FINALIZADA" : "RESPONDER"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={loadSurveys} tintColor="#5b55c0" />
                        }
                    />
                </View>
            </View>
        </ResponsiveLayout>
    );
};

export default SurveyListScreen;