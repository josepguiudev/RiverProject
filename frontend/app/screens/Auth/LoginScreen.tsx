import React, { useState } from "react";
import { 
    View, Text, TouchableOpacity, Image, 
    Alert, ScrollView, Platform, KeyboardAvoidingView, 
    SafeAreaView 
} from "react-native";
import TypeWriter from "react-native-typewriter";
import { useNavigation } from "@react-navigation/native";
import { isWeb } from "@/app/utils/device";

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
                password
            });
            const data = response.data;
            
            /**
             * ACTUALIZACIÓN DEL CONTEXTO GLOBAL:
             * Al mutar el estado 'user', React Navigation desmonta automáticamente
             * esta pantalla y monta el stack correspondiente sin necesidad de hacer redirecciones manuales.
             */
            await login(data.user, data.token, data.role, data.registrationStep);

        } catch (error: any) {
            console.error("Login Error:", error);
            const errorMessage = error.response?.data?.error || "Credenciales incorrectas";
            Alert.alert("Error de acceso", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER WEB ---
    if (isWeb) {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.background }}>
                <View style={styles.alineadoPersonal}>
                    <View style={styles.contendorLogoTitulos}>
                        <Image 
                            source={require('../../../assets/images/logo.png')} 
                            style={styles.logo} 
                            resizeMode="contain"
                        />
                        <View style={styles.contenedorWritter}>
                            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
                                {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.caja, isDesktopView && { width: 500 }]}>
                        <Text style={[styles.mainText, { marginBottom: 20, textAlign: 'center' }]}>Iniciar Sesión</Text>

                        <View style={styles.formStack}>
                            <CustomInputText 
                                label="Email" 
                                placeholder="ejemplo@correo.com" 
                                onChangeText={setEmail} 
                                value={email} 
                                autoCapitalize="none"
                            />
                            <View style={{ marginTop: 20 }}>
                                <CustomInputText 
                                    label="Contraseña" 
                                    placeholder="****" 
                                    secureTextEntry 
                                    onChangeText={setPassword} 
                                    value={password} 
                                />
                            </View>
                        </View>

                        <View style={{ width: '100%', marginTop: 30, alignItems: 'center' }}>
                            <CustomButton 
                                title={isSubmitting ? "ENTRANDO..." : "INICIAR SESIÓN"} 
                                onPress={handleLogin} 
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
            </ScrollView>
        );
    }

    // --- RENDER MOBILE ---
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.alineadoPersonal, { paddingVertical: 40 }]}>
                        <View style={styles.contendorLogoTitulos}>
                            <Image 
                                source={require('../../../assets/images/logo.png')} 
                                style={styles.logo} 
                                resizeMode="contain"
                            />
                            <View style={styles.contenedorWritter}>
                                <Text style={styles.tituloHero}>
                                    {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                                </Text>
                            </View>
                        </View>

                        <View style={styles.caja}>
                            <Text style={[styles.mainText, { marginBottom: 25, textAlign: 'center' }]}>Iniciar Sesión</Text>
                            
                            <View style={styles.formStack}>
                                <CustomInputText
                                    label="Email"
                                    placeholder="ejemplo@correo.com"
                                    onChangeText={setEmail}
                                    value={email}
                                    autoCapitalize="none"
                                />
                                <View style={{ marginTop: 20 }}>
                                    <CustomInputText
                                        label="Contraseña"
                                        placeholder="****"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        value={password}
                                    />
                                </View>
                            </View>
                            
                            <View style={{ width: '100%', marginTop: 35, alignItems: 'center' }}>
                                <CustomButton 
                                    title={isSubmitting ? "ENTRANDO..." : "INICIAR SESIÓN"} 
                                    onPress={handleLogin} 
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
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}