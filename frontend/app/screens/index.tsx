import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { styles } from '../screens/stylesIndex';
import SignIn from '../components/auth/signin/signin';
import SignUp from '../components/auth/signup/signup';

const IndexScreen = ({ navigation }: any) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openLogin = () => {
    setIsSignUpOpen(false);
    setTimeout(() => setIsLoginOpen(true), 250);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setTimeout(() => setIsSignUpOpen(true), 250);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

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

      {/* Modal de Inicio de Sesión */}
      <SignIn
        isVisible={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
        navigation={navigation}
      />

      {/* Modal de Registro */}
      <SignUp
        isVisible={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={openLogin}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default IndexScreen;