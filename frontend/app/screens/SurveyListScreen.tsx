import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SurveyCard } from '../components/QuestionCard/SurveyCard';
import { FormApiService } from '../services/api/service';
import { Survey } from '../types/formsSurvey.types';

const SurveyListScreen = ({ navigation }: any) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FormApiService.getAllResponses(); // El teu GET /responses
        setSurveys(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator style={{flex: 1}} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explorar Enquestes</Text>
      <FlatList
        data={surveys}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} 
        renderItem={({ item }) => (
          <SurveyCard 
            survey={item}
            isCompleted={false} 
            onPress={() => navigation.navigate('SuerveyAnswers', { surveyId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ebf8', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#202124' }
});

export default SurveyListScreen;