import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, TouchableWithoutFeedback, Animated, Dimensions, 
  Pressable, Easing, TouchableOpacity, Alert, Platform 
} from 'react-native';
import styles from './styles';
import strings from "../../../assets/supportFiles/strings.json";
import { useNavigation } from '@react-navigation/native';
import { isWeb } from "@/app/utils/device";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../screens/Auth/AuthContext";

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = isWeb ? SCREEN_WIDTH * 0.18 : SCREEN_WIDTH * 0.8;

const SteamMenuItem = ({ label, icon, onPress }: any) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[styles.itemContenedor, hovered && styles.itemHover]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={isWeb ? 18 : 24} 
            color={hovered ? '#66c0f4' : 'white'} 
            style={{ marginRight: 12 }} 
          />
        )}
        <Text style={[styles.item, hovered && styles.itemTextHover]}>{label}</Text>
      </View>
    </Pressable>
  );
};

export default function MenuLateral({ visible, onClose }: any) {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();  
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  // Clasificación de Roles según tus especificaciones
  const isAdmin = user?.role === 'ADMIN';
  const isClient = user?.hasOwnProperty('cuentaBancaria') || user?.role === 'CLIENT';
  const isRegularUser = !isAdmin && !isClient; // User estándar (no admin, no client)

  const navigateTo = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: 400,
      easing: Easing.out(Easing.back(0.5)),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // Método para gestionar el Log Out y redirigir al Login
  const handleLogoutClick = () => {
    onClose(); // Cierra el menú antes de la acción

    const ejecutarCierre = () => {
      logout(); // Limpia el contexto de autenticación
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Redirige de raíz a la pantalla de Login
      });
    };

    if (Platform.OS === 'web') {
      if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        ejecutarCierre();
      }
    } else {
      Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro de que deseas salir?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: ejecutarCierre }
        ]
      );
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        
        {/* CABECERA */}
        <View style={{ paddingHorizontal: 10, marginBottom: 5 }}>
          <Text style={styles.title}>{strings.name}</Text>
          <Text style={{ color: '#66c0f4', fontSize: 10, paddingLeft: 10, marginTop: -5 }}>
            {isAdmin ? "MODO ADMIN" : isClient ? "MODO EMPRESA" : "ONLINE"}
          </Text>
        </View>
        
        <View style={styles.linea} />
        
        {/* ==========================================
            OPCIONES PARA USER (NO ADMIN / NO CLIENT)
           ========================================== */}
        {isRegularUser && (
          <>
            <SteamMenuItem icon="document-text-outline" label="Encuestas" onPress={() => navigateTo("SurveyList")} />
            <SteamMenuItem icon="person-outline" label="Mi Perfil" onPress={() => navigateTo("Profile")} />
          </>
        )}

        {/* ==========================================
            OPCIONES PARA ADMIN
           ========================================== */}
        {isAdmin && (
          <>
            <Text style={{ color: '#555', fontSize: 11, fontWeight: 'bold', paddingLeft: 15, marginVertical: 5 }}>ADMINISTRACIÓN</Text>
            <SteamMenuItem icon="stats-chart-outline" label={strings.adminScreen} onPress={() => navigateTo("Admin")} />
            <SteamMenuItem icon="people-outline" label={strings.usersScreen} onPress={() => navigateTo("AdminUser")} />
            <SteamMenuItem icon="game-controller-outline" label={strings.usersGenreGames} onPress={() => navigateTo("AdminGenresGames")} />
            <SteamMenuItem icon="pie-chart-outline" label={strings.graphics} onPress={() => navigateTo("AdminGraphics")} />
            
            <View style={styles.linea} />
            <Text style={{ color: '#555', fontSize: 11, fontWeight: 'bold', paddingLeft: 15, marginVertical: 5 }}>VISTAS EMPRESA</Text>
            <SteamMenuItem icon="briefcase-outline" label="Dashboard Client" onPress={() => navigateTo("ClientDashboard")} />
          </>
        )}

        {/* ==========================================
            OPCIONES PARA CLIENT
           ========================================== */}
        {isClient && (
          <>
            <SteamMenuItem icon="briefcase-outline" label="Dashboard Client" onPress={() => navigateTo("ClientDashboard")} />
          </>
        )}

        {/* ==========================================
            PIE DEL MENÚ (CERRAR SESIÓN)
           ========================================== */}
        <View style={{ flex: 1 }} /> {/* Empuja el botón al fondo */}
        <View style={styles.linea} />
        <SteamMenuItem 
          icon="log-out-outline" 
          label={strings.cerrarSesion} 
          onPress={handleLogoutClick} 
        />
        
      </Animated.View>
    </View>
  );
}