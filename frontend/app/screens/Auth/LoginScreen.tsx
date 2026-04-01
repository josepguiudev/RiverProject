import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, Alert, ScrollView } from "react-native";
import TypeWriter from "react-native-typewriter";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import styles from "../stylesGlobal"; // Tu archivo de estilos unificado
import { useLayout } from "@/app/utils/useLayout";
import { useAuth } from "../Auth/AuthContext"; 

export default function LoginScreen() {
    const navigation = useNavigation<any>();
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
        // Ajuste de IP para emuladores Android vs Web
        const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
        
        try {
            // Llamada al nuevo AuthService2
            const response = await fetch(`${baseUrl}/api/auth2/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password: password 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error de acceso", data.error || "Credenciales incorrectas");
                return;
            }

            // Guardamos en el AuthContext (User/Client + Token)
            await login(data.user, data.token);

            // --- LÓGICA DE REDIRECCIÓN ---
            // Si el objeto tiene 'cuentaBancaria', es un Cliente
            const isClient = data.user.hasOwnProperty('cuentaBancaria');

            if (isClient) {
                console.log("Acceso como Empresa detectado");
                navigation.replace("ClientDashboard"); 
            } else {
                console.log("Acceso como Jugador detectado");
                navigation.replace("SurveyList");
            }

        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error de conexión", "No se pudo contactar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0e0d0df1' }}>
            <View style={styles.alineadoPersonal}>
                
                {/* Header con Logo y Título Animado */}
                <View style={styles.contendorLogoTitulos}>
                    <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
                    <View style={styles.contenedorWritter}>
                        <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
                            {strings.nameMayus}{" "}
                            <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                        </Text>
                    </View>
                </View>

                {/* Caja de Login */}
                <View style={[styles.caja, isDesktopView && styles.cajaDesktop]}>
                    <Text style={[styles.mainText, { marginBottom: 30 }]}>Iniciar Sesión</Text>
                    
                    <View style={{ width: '100%', maxWidth: 400 }}>
                        <CustomInputText
                            label={strings.direccionEmail}
                            placeholder={strings.placeEmail}
                            onChangeText={setEmail}
                            value={email}
                        />
                        <View style={{ marginTop: 10 }}>
                            <CustomInputText
                                label={strings.contrasenia}
                                placeholder={strings.placePassword}
                                secureTextEntry
                                onChangeText={setPassword}
                                value={password}
                            />
                        </View>
                        
                        <View style={{ marginTop: 30 }}>
                            <CustomButton 
                                title={isSubmitting ? "Entrando..." : strings.login} 
                                onPress={handleLogin} 
                                disabled={isSubmitting}
                            />
                        </View>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate("Register")} 
                            style={{ marginTop: 25, alignItems: 'center' }}
                        >
                            <Text style={styles.texto}>
                                ¿No tienes cuenta? <Text style={styles.blueText}>Regístrate aquí</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}