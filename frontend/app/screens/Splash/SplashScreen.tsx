import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import { styles } from './styles';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator 
      size="large" color="#4CAF50" />
      <Text style={styles.title}>
        Splash funcionando ✔️</Text>
      <Text style={styles.subtitle}>
        Todo está bien configurado</Text>
    </View>
  );
}
