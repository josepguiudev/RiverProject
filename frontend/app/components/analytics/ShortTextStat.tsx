import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../screens/stylesGlobal';

export const ShortTextStat = ({ title, responses }: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
        <Text style={styles.questionTitle}>{title}</Text>
      </View>
      {responses.slice(0, 3).map((txt: string, index: number) => (
        <View key={index} style={styles.bubble}>
          <Text style={styles.text}>"{txt}"</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#161616', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  questionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bubble: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: colors.primary },
  text: { color: '#aaa', fontSize: 13, fontStyle: 'italic' }
});