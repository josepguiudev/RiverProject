import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SurveyCard } from '../components/QuestionCard/SurveyCard';
import { FormApiService } from '../services/api/service';
import { Survey } from '../types/formsSurvey.types';
import styles from './stylesGlobal';
import { ResponsiveLayout } from '../components/ResponsiveLayout';
import { useAuth } from "../screens/Auth/AuthContext";

const SurveyListScreen = ({ navigation }: any) => {
    const { user, loading: authLoading } = useAuth();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadSurveys = async () => {
        if (!user?.id) return;
        try {
            const data = await FormApiService.getAllResponses();
            setSurveys(data);
        } catch (e) {
            Alert.alert("Error", "No se pudieron cargar las encuestas.");
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

    if (authLoading || (loading && !refreshing)) {
        return (
            <View style={styles.alineadoPersonal}>
                <ActivityIndicator size="large" color="#5b55c0" />
            </View>
        );
    }

    return (
        <ResponsiveLayout>
            <Text style={[styles.tituloHero, { marginBottom: 30 }]}>Encuestas</Text>
            <FlatList
                data={surveys}
                keyExtractor={(item) => (item.id || Math.random()).toString()}
                renderItem={({ item }) => (
                    <SurveyCard 
                        survey={item}
                        isCompleted={item.completada || false} 
                        onPress={() => navigation.navigate('TakeSurvey', { surveyId: item.id })}
                        style={item.completada ? { opacity: 0.5 } : null}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSurveys(); }} tintColor="#5b55c0" />
                }
            />
        </ResponsiveLayout>
    );
};

export default SurveyListScreen;