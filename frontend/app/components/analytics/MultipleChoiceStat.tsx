import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../screens/stylesGlobal';

export const MultipleChoiceStat = ({ title, results, totalParticipants }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.questionTitle}>{title}</Text>
      {results.map((item: any, index: number) => {
        const percentage = ((item.votes / (totalParticipants || 1)) * 100).toFixed(1);
        return (
          <View key={index} style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{percentage}%</Text>
            </View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.total}>{item.votes} pts</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#161616', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  badge: { width: 45, height: 24, backgroundColor: colors.secondary + '20', borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.secondary },
  badgeText: { color: colors.secondary, fontSize: 10, fontWeight: 'bold' },
  label: { color: '#bbb', marginLeft: 12, flex: 1 },
  total: { color: '#666', fontSize: 12 }
});