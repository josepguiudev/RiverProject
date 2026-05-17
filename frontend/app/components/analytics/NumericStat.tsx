import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../screens/stylesGlobal';

export const NumericStat = ({ title, average, max = 100 }: any) => {
  const percentage = Math.min((average / max) * 100, 100);
  
  return (
    <View style={styles.card}>
      <Text style={styles.questionTitle}>{title}</Text>
      <View style={styles.container}>
        <Text style={styles.number}>{average.toFixed(1)}</Text>
        <Text style={styles.label}>Valor Promedio</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#161616', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  container: { alignItems: 'center', marginVertical: 10 },
  number: { color: colors.primary, fontSize: 48, fontWeight: '900' },
  label: { color: colors.textSecondary, fontSize: 12, textTransform: 'uppercase' },
  barBg: { height: 6, backgroundColor: '#222', borderRadius: 3, marginTop: 10 },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 }
});