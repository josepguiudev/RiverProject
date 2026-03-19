import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Survey } from '../../types/formsSurvey.types';

interface Props {
  survey: Survey;
  isCompleted: boolean;
  onPress: () => void;
}

export const SurveyCard = ({ survey, isCompleted, onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isCompleted && styles.completedCard]} 
      onPress={onPress}
      disabled={isCompleted} // Bloquejada si ja està feta
    >
      <View style={styles.content}>
       <Text style={[styles.title, isCompleted && styles.completedText]}>
        {survey.nombreEncuesta || survey.name || "Enquesta sense títol"}
        </Text>
        <Text style={styles.info}>Preguntes: {survey.numQuestions}</Text>
        {isCompleted && <Text style={styles.status}>✓ Ja realitzada</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 3 
  },
  completedCard: { 
    backgroundColor: '#e0e0e0', 
    opacity: 0.7 
  },
  // AFEGEIX AIXÒ:
  content: {
    flexDirection: 'column',
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#673ab7' 
  },
  completedText: { 
    color: '#757575' 
  },
  info: { 
    color: '#666', 
    marginTop: 5 
  },
  status: { 
    color: '#4caf50', 
    fontWeight: 'bold', 
    marginTop: 10 
  }
});