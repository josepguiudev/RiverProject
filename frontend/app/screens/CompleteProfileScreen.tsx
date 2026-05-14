import React, { useState } from "react";
import { View, Text, Alert, Platform, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useAuth } from "./Auth/AuthContext";
import { CustomDatePicker } from "../components/QuestionCard/CustomDatePicker";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";
import { isWeb } from "../utils/device";

export default function CompleteProfileScreen({ navigation }: any) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    apellido1: "",
    apellido2: "",
    fechaNacimiento: "", // Formato YYYY-MM-DD
    genero: 0,
    localizacion: ""
  });

  const generoOptions = [
    { label: "Masculino", value: 0 },
    { label: "Femenino", value: 1 },
    { label: "No Binario", value: 2 },
    { label: "Otro", value: 3 },
  ];

  // Función de cálculo de edad corregida
  const calculateAge = (birthdayStr: string) => {
    const birthday = new Date(birthdayStr);
    if (isNaN(birthday.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleNextStep = async () => {
    // 1. Validaciones previas
    if (!formData.apellido1 || !formData.fechaNacimiento || !formData.localizacion) {
      Alert.alert("Error", "Por favor, completa los campos obligatorios.");
      return;
    }

    const edadCalculada = calculateAge(formData.fechaNacimiento);

    if (edadCalculada === null) {
      Alert.alert("Error", "Fecha de nacimiento inválida. Usa el formato AAAA-MM-DD");
      return;
    }

    if (edadCalculada < 13) {
      Alert.alert("Aviso", "Debes ser mayor de 13 años para continuar.");
      return;
    }

    // 2. Preparar el Body para el Backend
    const body = {
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      genero: formData.genero,
      localizacion: formData.localizacion,
      fechaNacimiento: formData.fechaNacimiento,
      edad: edadCalculada
    };

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    try {
      const res = await fetch(`${baseUrl}/api/auth2/complete-profile/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        navigation.replace("ConnectSteam");
      } else {
        const errorMsg = await res.text();
        Alert.alert("Error", errorMsg || "No se pudo guardar la información.");
      }
    } catch (error) {
      Alert.alert("Error", "Error de conexión con el servidor.");
    }
  };

  // ============================================================
  //  VERSIÓN WEB (original, sin cambios)
  // ============================================================
  if (isWeb) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0e0d0df1', padding: 20 }}>
        <View style={[styles.caja, { alignSelf: 'center', width: '100%', maxWidth: 500 }]}>
          <Text style={styles.mainText}>Paso 2: Completa tu Perfil</Text>

          <CustomInputText 
            label="Primer Apellido" 
            placeholder="Tu primer apellido" 
            onChangeText={(t) => setFormData({...formData, apellido1: t})} 
          />

          <CustomInputText 
            label="Segundo Apellido (Opcional)" 
            placeholder="Tu segundo apellido" 
            onChangeText={(t) => setFormData({...formData, apellido2: t})} 
          />

          <CustomDatePicker 
            label="Fecha de Nacimiento" 
            value={formData.fechaNacimiento} 
            onChange={(val) => setFormData({...formData, fechaNacimiento: val})} 
          />

          <Text style={[styles.texto, { marginTop: 15, marginBottom: 10, color: '#aaa' }]}>Género</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {generoOptions.map((opt) => (
              <TouchableOpacity 
                key={opt.value}
                onPress={() => setFormData({...formData, genero: opt.value})}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                  borderRadius: 8,
                  minWidth: '47%',
                  backgroundColor: formData.genero === opt.value ? '#007AFF' : '#1a1a1a',
                  borderWidth: 1,
                  borderColor: formData.genero === opt.value ? '#007AFF' : '#333',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInputText 
            label="Ciudad / Provincia" 
            placeholder="Ej: Madrid, España" 
            onChangeText={(t) => setFormData({...formData, localizacion: t})} 
          />

          <View style={{ marginTop: 20 }}>
            <CustomButton title="CONTINUAR AL PASO FINAL" onPress={handleNextStep} />
          </View>
        </View>
      </ScrollView>
    );
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil, optimizado)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: 500, alignSelf: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.white, textAlign: 'center', marginBottom: 24 }}>
            Paso 2: Completa tu Perfil
          </Text>

          <CustomInputText 
            label="Primer Apellido" 
            placeholder="Tu primer apellido" 
            onChangeText={(t) => setFormData({...formData, apellido1: t})} 
          />

          <CustomInputText 
            label="Segundo Apellido (Opcional)" 
            placeholder="Tu segundo apellido" 
            onChangeText={(t) => setFormData({...formData, apellido2: t})} 
          />

          <CustomDatePicker 
            label="Fecha de Nacimiento" 
            value={formData.fechaNacimiento} 
            onChange={(val) => setFormData({...formData, fechaNacimiento: val})} 
          />

          <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 16, marginBottom: 12 }}>Género</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {generoOptions.map((opt) => (
              <TouchableOpacity 
                key={opt.value}
                onPress={() => setFormData({...formData, genero: opt.value})}
                style={{
                  flex: 1,
                  minWidth: '45%',
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: formData.genero === opt.value ? colors.primary : '#1A1A1A',
                  borderWidth: 1,
                  borderColor: formData.genero === opt.value ? colors.primary : '#333',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInputText 
            label="Ciudad / Provincia" 
            placeholder="Ej: Madrid, España" 
            onChangeText={(t) => setFormData({...formData, localizacion: t})} 
          />

          <View style={{ marginTop: 28 }}>
            <CustomButton title="CONTINUAR AL PASO FINAL" onPress={handleNextStep} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}