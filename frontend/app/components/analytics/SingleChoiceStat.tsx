import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../screens/stylesGlobal';

export const SingleChoiceStat = ({ title, results }: any) => {
  const maxVotes = Math.max(...results.map((r: any) => r.votes), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.questionTitle}>{title}</Text>
      {results.map((item: any, index: number) => (
        <View key={index} style={styles.itemWrapper}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.votes}>{item.votes} rptas</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { 
              width: `${(item.votes / maxVotes) * 100}%`,
              backgroundColor: index === 0 ? colors.primary : '#444' 
            }]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#161616', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 15 },
  itemWrapper: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: '#eee', fontSize: 14 },
  votes: { color: colors.secondary, fontWeight: 'bold' },
  barBg: { height: 8, backgroundColor: '#222', borderRadius: 4 },
  barFill: { height: '100%', borderRadius: 4 }
});