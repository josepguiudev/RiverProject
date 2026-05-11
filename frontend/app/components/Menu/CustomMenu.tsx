import React, { useRef, useEffect, useState  } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, Dimensions, Pressable, Easing } from 'react-native';
import styles from './styles';
import strings from "../../../assets/supportFiles/strings.json";
import globalStyles from '@/assets/globalStyles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/app/screens/Auth/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SteamMenuItemProps {
  label: string;
  onPress?: () => void; // El signo '?' lo hace opcional
}

// Componente auxiliar para el ítem con efecto Steam
const SteamMenuItem = ({ label, onPress }: SteamMenuItemProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
      // Para Web
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[styles.itemContenedor, hovered && styles.itemHover]}
    >
      <Text style={[styles.item, styles.maxHeight, globalStyles.alineadoPersonalVertical, hovered && styles.itemTextHover]}>
        {label}
      </Text>
    </Pressable>
  );
};

export default function MenuLateral({ visible, onClose }: any) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current; // Inicia fuera a la izquierda
  const navigation = useNavigation();
  const { logout } = useAuth();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SCREEN_WIDTH, // Se mueve a 0 si es visible
      duration: 500,
      easing: Easing.out(Easing.exp), // Empieza rápido y termina suave
      useNativeDriver: true,
    }).start();
  });

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
        <SteamMenuItem 
          label={strings.inicio} 
          onPress={() => { onClose(); navigation.navigate("Home" as never); }}
        />
        <SteamMenuItem 
          label={strings.adminScreen} 
          onPress={() => { onClose(); navigation.navigate("Admin" as never); }}
        />
        <SteamMenuItem 
          label={strings.usersScreen} 
          onPress={() => { onClose(); navigation.navigate("AdminUser" as never); }}
        />
        <SteamMenuItem 
          label={strings.perfil} 
          onPress={() => { onClose(); navigation.navigate("Profile" as never); }}
        />
        <SteamMenuItem label={strings.configuracion} />
        <SteamMenuItem 
          label={strings.cerrarSesion} 
          onPress={async () => {
            onClose();
            await logout();
            navigation.navigate("Login" as never);
          }}
        />
      </Animated.View>
    </View>
  );
}