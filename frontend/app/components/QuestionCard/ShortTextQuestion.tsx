import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
}

export const ShortTextQuestion = ({ question }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.icon}>Aa</Text>
        <Text style={styles.text}>
          Pregunta de <Text style={styles.bold}>respuesta abierta</Text> (una línea).
        </Text>
      </View>
      <View style={styles.previewLine} />
      <Text style={styles.helper}>Modo: Texto Alfanumérico</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 12,
    backgroundColor: 'rgba(162, 155, 254, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(162, 155, 254, 0.2)',
    borderStyle: 'dashed',
  },
  infoBox: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 18, color: '#A29BFE', marginRight: 10, fontWeight: 'bold' },
  text: { color: '#aaa', fontSize: 13, flex: 1 },
  bold: { color: '#fff', fontWeight: '600' },
  previewLine: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  helper: { color: '#555', fontSize: 9, textTransform: 'uppercase' }
});