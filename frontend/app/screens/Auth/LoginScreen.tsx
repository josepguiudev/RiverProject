import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, Alert, ScrollView, ActivityIndicator } from "react-native";
import TypeWriter from "react-native-typewriter";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import styles, { colors } from "./styles"; 
import { useLayout } from "@/app/utils/useLayout";
import { useAuth } from "../Auth/AuthContext"; 
import client from "../../api/client";

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { isDesktopView } = useLayout();
    const { login } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, rellena todos los campos");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await client.post("/api/auth2/login", {
                email: email.trim(), 
                password: password 
            });

            const data = response.data;
            await login(data.user, data.token, data.role, data.registrationStep);

            // Nota: App.tsx se encargará de la redirección automática 
            // al cambiar el estado del usuario en el AuthContext.

        } catch (error: any) {
            console.error("Login Error:", error);
            const errorMsg = error.response?.data?.error || error.response?.data || "Error de conexión";
            Alert.alert("Error de acceso", typeof errorMsg === 'string' ? errorMsg : "Credenciales incorrectas");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // El View raíz usa alineadoPersonal para el fondo y minHeight
        <View style={styles.alineadoPersonal}>
            <ScrollView 
                contentContainerStyle={styles.centeredContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Animado */}
                <View style={[styles.contendorLogoTitulos, { marginBottom: 40 }]}>
                    <Image 
                        source={require("../../../assets/images/logo.png")} 
                        style={styles.logo}
                        resizeMode="contain" // Corregido el warning de resizeMode
                    />
                    <View style={styles.contenedorWritter}>
                        <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
                            {strings.nameMayus}{" "}
                            <TypeWriter typing={1} style={styles.destaqueAzul}>
                                {strings.appMayus}
                            </TypeWriter>
                        </Text>
                    </View>
                </View>

                {/* Caja de Login principal */}
                <View style={[styles.caja, isDesktopView && styles.cajaDesktop]}>
                    <Text style={[styles.mainText, { marginBottom: 10 }]}>Bienvenido</Text>
                    <Text style={[styles.texto, { marginBottom: 30 }]}>Introduce tus credenciales para continuar</Text>
                    
                    <View style={{ width: '100%' }}>
                        <CustomInputText
                            label={strings.direccionEmail}
                            placeholder={strings.placeEmail}
                            onChangeText={setEmail}
                            value={email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        
                        <View style={{ marginTop: 20 }}>
                            <CustomInputText
                                label={strings.contrasenia}
                                placeholder={strings.placePassword}
                                secureTextEntry
                                onChangeText={setPassword}
                                value={password}
                            />
                        </View>

                        {/* Olvidé mi contraseña */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                            <Text style={[styles.textoChico, { color: colors.secondary }]}>
                                ¿Has olvidado tu contraseña?
                            </Text>
                        </TouchableOpacity>
                        
                        <View style={{ marginTop: 30, alignItems: 'center' }}>
                            <CustomButton 
                                title={isSubmitting ? "Entrando..." : strings.login} 
                                onPress={handleLogin} 
                                disabled={isSubmitting}
                            />
                        </View>

                        {/* Footer de Registro */}
                        <View style={[styles.row, { marginTop: 25, justifyContent: 'center' }]}>
                            <Text style={styles.texto}>¿No tienes cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={[styles.texto, styles.blueText, { fontWeight: 'bold' }]}>
                                    Regístrate aquí
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                {/* Texto de ayuda o copyright al final */}
                <Text style={[styles.textoChico, { marginTop: 40, opacity: 0.5 }]}>
                    River Project © 2026 - Todos los derechos reservados
                </Text>
            </ScrollView>
        </View>
    );
}