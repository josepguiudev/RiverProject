import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, TouchableWithoutFeedback, Animated, Dimensions, 
  Pressable, Easing, SafeAreaView, Platform, TouchableOpacity 
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
        {icon && <Ionicons name={icon} size={isWeb ? 18 : 24} color={hovered ? '#66c0f4' : 'white'} style={{ marginRight: 12 }} />}
        <Text style={[styles.item, hovered && styles.itemTextHover]}>{label}</Text>
      </View>
    </Pressable>
  );
};

export default function MenuLateral({ visible, onClose }: any) {
  const navigation = useNavigation();
  const { user } = useAuth();  // ya tenemos cuentaBancaria si es cliente
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: 400,
      easing: Easing.out(Easing.back(0.5)),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  // MISMA LÓGICA QUE EN LoginScreen
  const goToDashboard = () => {
    const isClient = user?.hasOwnProperty('cuentaBancaria');
    if (isClient) {
      navigation.navigate("ClientDashboard" as never);
    } else {
      navigation.navigate("SurveyList" as never);
    }
    onClose();
  };

  const MenuContent = () => (
    <>
      <TouchableOpacity onPress={goToDashboard} activeOpacity={0.7} style={{ paddingHorizontal: 10 }}>
        <Text style={styles.title}>{strings.name}</Text>
        <Text style={{ color: '#66c0f4', fontSize: 10, paddingLeft: 10, marginTop: -5 }}>ONLINE</Text>
      </TouchableOpacity>
      
      <View style={styles.linea} />
      
      <SteamMenuItem icon="stats-chart-outline" label={strings.adminScreen} onPress={() => { navigation.navigate("Admin" as never); onClose(); }}/>
      <SteamMenuItem icon="people-outline" label={strings.usersScreen} onPress={() => { navigation.navigate("AdminUser" as never); onClose(); }}/>
      <SteamMenuItem icon="person-circle-outline" label={strings.perfil} onPress={() => { navigation.navigate("Profile" as never); onClose(); }}/>
      <SteamMenuItem icon="settings-outline" label={strings.configuracion} onPress={() => { navigation.navigate("Settings" as never); onClose(); }}/>
      
      <View style={{ flex: 1 }} />
      <View style={styles.linea} />
      <SteamMenuItem icon="log-out-outline" label={strings.cerrarSesion} onPress={() => { /* lógica cerrar sesión */ onClose(); }}/>
    </>
  );

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.menuContainer, { width: MENU_WIDTH, transform: [{ translateX: slideAnim }] }]}>
        {isWeb ? <MenuContent /> : <SafeAreaView style={{ flex: 1 }}><MenuContent /></SafeAreaView>}
      </Animated.View>
    </View>
  );
}