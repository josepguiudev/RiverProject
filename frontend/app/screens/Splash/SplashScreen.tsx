import React from 'react';
import { View, Text, ActivityIndicator, useWindowDimensions } from 'react-native';
import { styles } from './styles';
import { isWeb } from '../../utils/device';

export default function SplashScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 800;

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={isWeb ? "large" : "small"} // Ejemplo de lógica por plataforma
        color={isWeb ? "#4CAF50" : "#FFFFFF"} 
      />
      
      <Text style={[
        styles.title, 
        isLargeScreen && { fontSize: 32 } // Estilo extra si la pantalla es grande
      ]}>
        Splash funcionando ✔️
      </Text>

      <Text style={styles.subtitle}>
        {isWeb ? "Accediendo desde el Navegador" : "Iniciando App Móvil"}
      </Text>
    </View>
  );
}