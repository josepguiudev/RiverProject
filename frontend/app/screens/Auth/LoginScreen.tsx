import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TypeWriter from "react-native-typewriter";

import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import styles from "../stylesGlobal";
import { useLayout } from "@/app/utils/useLayout";
import { ResponsiveLayout } from "../../components/ResponsiveLayout";
import { useAuth } from "../Auth/AuthContext"; // Asegúrate de que la ruta sea correcta

export default function LoginScreen({ navigation }: any) {
    const { isDesktopView } = useLayout();
    const { login } = useAuth();
    const cursorOpacity = React.useRef(new Animated.Value(1)).current;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
                Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
            ]),
        ).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, rellena todos los campos");
            return;
        }

        setIsSubmitting(true);
        const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
        
        try {
            const response = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password: password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Si el backend lanza error, mostramos el mensaje que viene del ExceptionHandler
                Alert.alert("Error de acceso", data.error || "Credenciales incorrectas");
                return;
            }

            // Guardamos en el contexto (esto activa el ID de usuario en toda la app)
            await login(data.user, data.token);
            navigation.replace("SurveyList");

        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error de conexión", "No se pudo contactar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ResponsiveLayout>
            <View style={[styles.row, { marginBottom: 20 }]}>
                <View style={{ width: 60, height: 60, marginRight: 15 }}>
                    <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
                </View>
                <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
                    {strings.nameMayus}{" "}
                    <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                </Text>
            </View>

            <View style={{ width: '100%' }}>
                <CustomInputText
                    label={strings.direccionEmail}
                    placeholder={strings.placeEmail}
                    onChangeText={setEmail}
                    value={email}
                />
                <CustomInputText
                    label={strings.contrasenia}
                    placeholder={strings.placePassword}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                
                <View style={{ marginTop: 20 }}>
                    <CustomButton 
                        title={isSubmitting ? "Cargando..." : strings.login} 
                        onPress={handleLogin} 
                        disabled={isSubmitting}
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
                    <Text style={[styles.texto, { textAlign: 'center', color: '#64B5F6' }]}>{strings.noCuenta}</Text>
                </TouchableOpacity>
            </View>
        </ResponsiveLayout>
    );
}