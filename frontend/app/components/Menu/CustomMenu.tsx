import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Dimensions, Easing } from 'react-native';
import styles from './styles';
import strings from "../../../assets/supportFiles/strings.json";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MenuLateral({ visible, onClose }: any) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current; // Inicia fuera a la izquierda

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SCREEN_WIDTH, // Se mueve a 0 si es visible
      duration: 500,
      easing: Easing.out(Easing.exp), // Empieza rápido y termina suave
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Tap afuera para cerrar */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.title}>{strings.name}</Text>
        <View style={styles.linea} />
        
        {/* Aquí tus opciones de menú */}
        <Text style={styles.item}>{strings.perfil}</Text>
        <Text style={styles.item}>{strings.configuracion}</Text>
        <Text style={styles.item}>{strings.cerrarSesion}</Text>
      </Animated.View>
    </View>
  );
}