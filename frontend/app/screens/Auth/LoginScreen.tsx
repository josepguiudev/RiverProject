import React, { useState, useEffect  } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import TypeWriter from "react-native-typewriter";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
        alert("Login incorrecto");
        return;
        }

        const data = await res.json();
        await AsyncStorage.setItem("token", data.token);
        navigation.replace("Home");
    };

    const cursorOpacity = React.useRef(new Animated.Value(1)).current;

    // Animación del cursor parpadeante
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }, []);

    return (
    <View style={[styles.borde, styles.maxWidth, styles.maxHeigth]}>
      <View style={[styles.containerFoto, styles.borde]}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logo} 
        />
      </View>
      <View style={[styles.contenedorWritter, styles.borde]}>
        <Text style={styles.tituloHero}>
          RIVER{" "} 
          <TypeWriter typing={1} style={styles.destaqueAzul}>
            APP
          </TypeWriter>
        </Text>
      </View>
      <View style={[styles.contenedorWritter, styles.borde]}>
        <View style={styles.textWrapper}>
          <TypeWriter 
            typing={1} 
            maxDelay={50}
            style={styles.mainText}
          >
            Soluciones estadísticas del mercado <Text style={styles.blueText}>Gaming.</Text>
          </TypeWriter>
          
          {/* El cursor va fuera para que siempre esté al final */}
          <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
        </View>
      </View>
      <View style={styles.caja}>
        <CustomInputText label="Dirección de correo electrónico" placeholder="pruebapolitecnics@gmail.com" onChangeText={setEmail}/>
        <CustomInputText label="Contraseña" placeholder="Password" secureTextEntry onChangeText={setPassword}/>
        <CustomButton title="Login" onPress={handleLogin} />
        <View style={[styles.maxWidth, styles.borde, styles.margen1]}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={[styles.texto, styles.alineadoPersonal]}>No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

