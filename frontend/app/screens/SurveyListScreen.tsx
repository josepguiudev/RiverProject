import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SurveyCard } from '../components/QuestionCard/SurveyCard';
import { FormApiService } from '../services/api/service';
import { Survey } from '../types/formsSurvey.types';

const SurveyListScreen = ({ navigation }: any) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSurveys = async () => {
    try {
      // Llamada al endpoint /api/surveys/all
      const data = await FormApiService.getAllResponses();
      setSurveys(data);
    } catch (e) {
      console.error("Error list:", e);
      Alert.alert("Error", "No s'han pogut carregar les enquestes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSurveys();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#673ab7" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explorar Enquestes</Text>
      <FlatList
        data={surveys}
        keyExtractor={(item) => (item.id || item.idEncuesta || Math.random()).toString()}
        renderItem={({ item }) => (
          <SurveyCard 
            survey={item}
            isCompleted={item.completada || false} 
            onPress={() => navigation.navigate('TakeSurvey', { surveyId: item.id || item.idEncuesta })}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No hi ha enquestes disponibles.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ebf8', padding: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#202124' },
  empty: { textAlign: 'center', marginTop: 50, color: '#666' }
});

export default SurveyListScreen;