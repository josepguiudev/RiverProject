import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, ScrollView, Alert } from "react-native";
import TypeWriter from "react-native-typewriter";
import styles from "./styles";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import { useLayout } from "@/app/utils/useLayout";

export default function RegisterScreen({ navigation, route }: any) {
  const { isDesktopView } = useLayout();
  const cursorOpacity = React.useRef(new Animated.Value(1)).current;

  // --- ESTADOS SIMPLIFICADOS (Solo Paso 1) ---
  const initialType = route?.params?.type || "USER";
  const [type, setType] = useState<"USER" | "CLIENT">(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [name, setName] = useState(""); // Nombre de pila o Empresa

  // Campos específicos Empresa (Se quedan aquí porque las empresas no tienen 3 pasos)
  const [cuentaBancaria, setCuentaBancaria] = useState("");

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Por favor, rellena los campos obligatorios");
      return;
    }

    if (password !== repassword) {
      Alert.alert("Error", strings.alertNotSamePassword);
      return;
    }

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    // Enviamos solo lo necesario para el Paso 1
    const bodyData = {
      type,
      email: email.trim(),
      password,
      name,
      ...(type === "CLIENT" && { cuentaBancaria }) // Solo si es empresa enviamos el IBAN ahora
    };

    try {
      const res = await fetch(`${baseUrl}/api/auth2/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        Alert.alert("Error", errorData);
        return;
      }

      // Si es USER, el backend ha creado el registro con registrationStep: 1
      Alert.alert("¡Éxito!", "Cuenta creada. Ahora inicia sesión para completar tu perfil.");
      navigation.navigate("Login");

    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#000000' }}>
      <View style={styles.alineadoPersonal}>

        <View style={styles.contendorLogoTitulos}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
          <View style={styles.contenedorWritter}>
            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
              {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
            </Text>
          </View>
        </View>

        <View style={[styles.caja, isDesktopView && { width: 500 }]}>
          <Text style={[styles.mainText, { marginBottom: 20 }]}>Crear Cuenta</Text>

          {/* SELECTOR TIPO */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => setType("USER")}
              style={[styles.selectorBtn, type === "USER" && styles.selectorBtnActive]}>
              <Text style={[styles.selectorText, type === "USER" && styles.selectorTextActive]}>Soy Jugador</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("CLIENT")}
              style={[styles.selectorBtn, type === "CLIENT" && styles.selectorBtnActive]}>
              <Text style={[styles.selectorText, type === "CLIENT" && styles.selectorTextActive]}>Soy Empresa</Text>
            </TouchableOpacity>
          </View>

          {/* FORMULARIO PASO 1 */}
          <View style={styles.formStack}>
            <CustomInputText label="Email" placeholder="ejemplo@correo.com" onChangeText={setEmail} value={email} />

            <CustomInputText
              label={type === "USER" ? "Nombre" : "Nombre de la Empresa"}
              placeholder="¿Cómo te llamas?"
              onChangeText={setName}
              value={name}
            />

            {type === "CLIENT" && (
              <CustomInputText label="Cuenta Bancaria (IBAN)" placeholder="ES00 0000..." onChangeText={setCuentaBancaria} value={cuentaBancaria} />
            )}

            <CustomInputText label="Contraseña" placeholder="****" secureTextEntry onChangeText={setPassword} value={password} />
            <CustomInputText label="Confirmar Contraseña" placeholder="****" secureTextEntry onChangeText={setRepassword} value={repassword} />
          </View>

          <View style={{ width: '100%', marginTop: 25, alignItems: "center" }}>
            <CustomButton title="CREAR CUENTA" onPress={handleRegister} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={styles.texto}>¿Ya tienes cuenta? <Text style={styles.blueText}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}