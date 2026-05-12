import React, { useState } from "react";
import { View, Text, Alert, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./Auth/AuthContext";
import client from "../api/client";
import { CustomDatePicker } from "../components/QuestionCard/CustomDatePicker";
// ... (resto de imports)

/**
 * Pantalla de completar perfil (Paso 2 del onboarding).
 * Permite al jugador introducir sus apellidos, fecha de nacimiento, género y localización.
 */
export default function CompleteProfileScreen({ navigation }: any) {
  // Extraemos el usuario y la función para actualizar el paso de registro desde el contexto de auth
  const { user, updateRegistrationStep } = useAuth();

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

  /**
   * Maneja el envío del formulario al backend para completar el paso 2.
   * Valida los campos obligatorios y la edad del usuario antes de enviar.
   */
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

    try {
      // Usamos el cliente centralizado para la petición
      const res = await client.put(`/api/auth2/complete-profile/${user?.id}`, body);

      if (res.status === 200) {
        // Actualizamos el paso de registro a 2 (Vincular Steam)
        await updateRegistrationStep(2);
        // No hace falta navigation.navigate ya que App.tsx detectará el cambio de step
      }
    } catch (error: any) {
      const errorMsg = error.response?.data || "Error de conexión con el servidor.";
      Alert.alert("Error", typeof errorMsg === 'string' ? errorMsg : "No se pudo guardar la información.");
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