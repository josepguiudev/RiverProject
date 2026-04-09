import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Question } from '../../types/formsSurvey.types';

interface Props {
  question: Question;
}

export const NumericQuestion = ({ question }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.icon}>#</Text>
        <Text style={styles.text}>
          El usuario responderá únicamente con <Text style={styles.bold}>números</Text>.
        </Text>
      </View>
      <View style={styles.previewLine} />
      <Text style={styles.helper}>Modo: Teclado Numérico</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 12,
    backgroundColor: 'rgba(0, 168, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.2)',
    borderStyle: 'dashed',
  },
  infoBox: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 18, color: '#00A8FF', marginRight: 10, fontWeight: 'bold' },
  text: { color: '#aaa', fontSize: 13, flex: 1 },
  bold: { color: '#fff', fontWeight: '600' },
  previewLine: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  helper: { color: '#555', fontSize: 9, textTransform: 'uppercase' }
});