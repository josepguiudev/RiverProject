import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ActivityIndicator, KeyboardAvoidingView, 
  Platform, ScrollView, Modal, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { CommonActions } from '@react-navigation/native'; // Necesario para el reset
import { styles } from '../styles';

interface SignUpProps {
  isVisible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  navigation: any;
}

export default function SignUp({ isVisible, onClose, onSwitchToLogin, navigation }: SignUpProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validaciones de seguridad
    if (!email || !password || !name) {
      Alert.alert("Error", "Nombre, email y contraseña son obligatorios.");
      return;
    }

    if (password !== repassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // Conversión de género para tu BD (M -> 0, F -> 1)
      const generoByte = gender.toUpperCase() === 'M' ? 0 : 1;

      const bodyData = {
        name,
        email,
        password,
        edad: parseInt(age) || 0,
        genero: generoByte,      
        localizacion: country    
      };

      const apiUrl = Platform.OS === 'android' ? "http://10.0.2.2:8080" : "http://localhost:8080";

      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      
      if (res.ok && data.token) {
        // --- FLUJO DE ÉXITO ---
        
        // A. Guardamos el token para futuras peticiones
        await AsyncStorage.setItem("token", data.token);
        
        // B. Cerramos el modal inmediatamente
        onClose(); 

        // C. Navegación forzada a Home
        // Usamos un delay de 600ms para que la animación del modal no bloquee el cambio de pantalla
        setTimeout(() => {
          console.log("Redirigiendo a Home...");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }], // Nombre exacto que tienes en App.tsx
            })
          );
        }, 600);

      } else {
        const msg = data.error || "No se pudo realizar el registro.";
        Alert.alert("Atención", msg);
      }
    } catch (error) {
      console.error("Error en el fetch de registro:", error);
      Alert.alert("Error de conexión", "Asegúrate de que el backend esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      visible={isVisible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.overlayContainer}
      >
        <View style={styles.darkBackground}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Crear Cuenta</Text>
                <Text style={styles.subtitle}>Únete a River Project</Text>
              </View>

              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput style={styles.input} placeholder="Tu nombre" placeholderTextColor="#546E7A" value={name} onChangeText={setName} />
              
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor="#546E7A" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '47%' }}>
                  <Text style={styles.label}>Edad</Text>
                  <TextInput style={styles.input} placeholder="20" placeholderTextColor="#546E7A" value={age} onChangeText={setAge} keyboardType="numeric" />
                </View>
                <View style={{ width: '47%' }}>
                  <Text style={styles.label}>Género (M/F)</Text>
                  <TextInput style={styles.input} placeholder="M" placeholderTextColor="#546E7A" value={gender} onChangeText={setGender} autoCapitalize="characters" />
                </View>
              </View>

              <Text style={styles.label}>País</Text>
              <TextInput style={styles.input} placeholder="España" placeholderTextColor="#546E7A" value={country} onChangeText={setCountry} />

              <Text style={styles.label}>Contraseña</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#546E7A" value={password} onChangeText={setPassword} secureTextEntry />

              <Text style={styles.label}>Repetir Contraseña</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#546E7A" value={repassword} onChangeText={setRepassword} secureTextEntry />

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleRegister} 
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Finalizar Registro</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}