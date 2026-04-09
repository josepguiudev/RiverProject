import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, ScrollView } from "react-native";
import TypeWriter from "react-native-typewriter";
import styles from "./styles"; // Asegúrate de que apunte a tu archivo de estilos unificado
import globalStyles from "@/assets/globalStyles/globalStyles";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import { useLayout } from "@/app/utils/useLayout";

export default function RegisterScreen({ navigation }: any) {
  const { isDesktopView } = useLayout();
  const cursorOpacity = React.useRef(new Animated.Value(1)).current;

  // --- ESTADOS ---
  const [type, setType] = useState<"USER" | "CLIENT">("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [name, setName] = useState("");
  
  // Campos específicos User (Jugador)
  const [apellido1, setApellido1] = useState("");
  const [apellido2, setApellido2] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState<number>(0); // 0: Masc, 1: Fem, 2: Otro
  const [localizacion, setLocalizacion] = useState("");

  // Campos específicos Client (Empresa)
  const [cuentaBancaria, setCuentaBancaria] = useState("");

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    if (password !== repassword) {
      alert(strings.alertNotSamePassword);
      return;
    }

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    const bodyData = {
      type,
      email,
      password,
      name, // En CLIENT esto es el nombre de empresa, en USER es el nombre de pila
      ...(type === "USER" ? { 
          apellido1, 
          apellido2, 
          edad: parseInt(edad) || 0, 
          genero, 
          localizacion 
      } : { 
          cuentaBancaria 
      })
    };

    try {
      const res = await fetch(`${baseUrl}/api/auth2/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        alert("Error: " + errorData);
        return;
      }

      alert(strings.alertCreaUser);
      navigation.navigate("Login");
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0e0d0df1' }}>
      <View style={styles.alineadoPersonal}>
        
        {/* HEADER */}
        <View style={styles.contendorLogoTitulos}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
          <View style={styles.contenedorWritter}>
            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
              {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
            </Text>
          </View>
        </View>

        {/* CAJA DE REGISTRO */}
        <View style={[styles.caja, isDesktopView && styles.cajaDesktop]}>
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

          {/* FORMULARIO GRID */}
          <View style={isDesktopView ? styles.formGrid : styles.formStack}>
            
            {/* COLUMNA IZQUIERDA */}
            <View style={isDesktopView ? styles.column : null}>
              <CustomInputText label="Email" placeholder={strings.placeEmail} onChangeText={setEmail} value={email} />
              <CustomInputText label={type === "USER" ? "Nombre" : "Nombre Empresa"} placeholder="Escribe aquí..." onChangeText={setName} value={name} />
              
              {type === "USER" && (
                <>
                  <CustomInputText label="Primer Apellido" placeholder="Apellido 1" onChangeText={setApellido1} value={apellido1} />
                  <CustomInputText label="Segundo Apellido" placeholder="Apellido 2" onChangeText={setApellido2} value={apellido2} />
                </>
              )}
            </View>

            {/* COLUMNA DERECHA */}
            <View style={isDesktopView ? styles.column : null}>
              {type === "USER" ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '45%' }}>
                      <CustomInputText label="Edad" placeholder="Ej: 25" onChangeText={setEdad} value={edad} keyboardType="numeric" />
                    </View>
                    <View style={{ width: '50%' }}>
                      <CustomInputText label="Ciudad" placeholder="Localización" onChangeText={setLocalizacion} value={localizacion} />
                    </View>
                  </View>
                  <CustomInputText label="Género" placeholder="Masculino / Femenino" onChangeText={(val) => setGenero(val.toLowerCase().startsWith('f') ? 1 : 0)} />
                </>
              ) : (
                <CustomInputText label="Cuenta Bancaria (IBAN)" placeholder="ES00 0000..." onChangeText={setCuentaBancaria} value={cuentaBancaria} />
              )}

              <CustomInputText label="Contraseña" placeholder="****" secureTextEntry onChangeText={setPassword} value={password} />
              <CustomInputText label="Confirmar" placeholder="****" secureTextEntry onChangeText={setRepassword} value={repassword} />
            </View>

          </View>

          <View style={{ width: '100%', marginTop: 25 }}>
            <CustomButton title={strings.registrar} onPress={handleRegister} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 20 }}>
            <Text style={styles.texto}>¿Ya tienes cuenta? <Text style={styles.blueText}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}