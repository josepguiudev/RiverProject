import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
// Importamos tus constantes de detección
import { isWeb, isAndroid } from '../utils/device'; 
import { styles } from '../screens/stylesIndex';
import SignIn from '../components/auth/signin/signin';
import SignUp from '../components/auth/signup/signup';

const IndexScreen = ({ navigation }: any) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Handlers con tiempos ajustados para evitar crasheos en Android nativo
  const openLogin = () => {
    setIsSignUpOpen(false);
    setTimeout(() => setIsLoginOpen(true), isAndroid ? 300 : 10);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setTimeout(() => setIsSignUpOpen(true), isAndroid ? 300 : 10);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Usamos tus constantes para el comportamiento de la barra */}
      {!isWeb && (
        <StatusBar 
          barStyle={isAndroid ? "dark-content" : "light-content"} 
          backgroundColor={isAndroid ? "#ffffff" : "transparent"}
        />
      )}
      
      <View style={styles.mainContainer}>
        <View style={styles.card}>
          <View style={styles.heroSection}>
            <Text style={styles.title}>River Project</Text>
            <Text style={styles.subtitle}>Tu plataforma de encuestas profesional.</Text>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => setIsLoginOpen(true)} 
            >
              <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={() => setIsSignUpOpen(true)}
            >
              <Text style={styles.btnSecondaryText}>Crear una cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* CLAVE PARA EL ERROR DE ANDROID: 
          Forzamos booleano con !! y usamos renderizado condicional 
      */}
      {isLoginOpen && (
        <SignIn 
          isVisible={!!isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onSwitchToRegister={openRegister}
          navigation={navigation} 
        />
      )}

      {isSignUpOpen && (
        <SignUp 
          isVisible={!!isSignUpOpen} 
          onClose={() => setIsSignUpOpen(false)} 
          onSwitchToLogin={openLogin}
          navigation={navigation} 
        />
      )}
    </SafeAreaView>
  );
};

export default IndexScreen;