import React, { useState } from "react";
import { View, Text, Alert, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./Auth/AuthContext";
import { CustomDatePicker } from "../components/QuestionCard/CustomDatePicker";
import CustomInputText from "../components/CustomInputText/CustomInputText";
import CustomButton from "../components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";

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
    { label: "Helicoptero", value: 3 },
  ];

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
    if (!formData.apellido1 || !formData.fechaNacimiento || !formData.localizacion) {
      Alert.alert("Error", "Por favor, completa los campos obligatorios.");
      return;
    }

    const edadCalculada = calculateAge(formData.fechaNacimiento);
    if (edadCalculada === null) {
      Alert.alert("Error", "Fecha de nacimiento inválida.");
      return;
    }

    if (edadCalculada < 13) {
      Alert.alert("Aviso", "Debes ser mayor de 13 años para continuar.");
      return;
    }

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

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.scrollContainer, { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }]}
    >
      <View style={[styles.cajaDesktop, { alignSelf: 'center', width: '100%', maxWidth: 500 }]}>
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
                backgroundColor: formData.genero === opt.value ? colors.primary : '#1a1a1a',
                borderWidth: 1,
                borderColor: formData.genero === opt.value ? colors.primary : '#333',
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

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <CustomButton title="CONTINUAR AL PASO FINAL" onPress={handleNextStep} />
        </View>
      </View>
    </ScrollView>
  );
}