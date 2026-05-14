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
// Usamos los estilos del register para que sean idénticos
import styles, { colors } from "./styles"; 
import { useLayout } from "@/app/utils/useLayout";
import { useAuth } from "../Auth/AuthContext"; 
import client from "../../api/client";
import { useAuth } from "../Auth/AuthContext";

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
            const response = await fetch(`${baseUrl}/api/auth2/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const textError = await response.text();
                data = { error: textError };
            }

            if (!response.ok) {
                Alert.alert("Error de acceso", data.error || "Credenciales incorrectas");
                return;
            }

            await login(data.user, data.token, data.role, data.registrationStep);

            if (data.role === 'CLIENT') {
                navigation.replace("ClientDashboard");
            } else {
                switch (data.registrationStep) {
                    case 1: navigation.replace("CompleteProfile"); break;
                    case 2: navigation.replace("ConnectSteam"); break;
                    default: navigation.replace("SurveyList");
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            const errorMsg = error.response?.data?.error || error.response?.data || "Error de conexión";
            Alert.alert("Error de acceso", typeof errorMsg === 'string' ? errorMsg : "Credenciales incorrectas");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ------------------------------------------------------------
    // VERSIÓN WEB
    // ------------------------------------------------------------
    if (isWeb) {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0e0d0df1' }}>
                <View style={styles.alineadoPersonal}>
                    <View style={styles.contendorLogoTitulos}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                        <View style={styles.contenedorWritter}>
                            <Text style={[styles.tituloHero, isDesktopView && styles.tituloHeroDesktop]}>
                                {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                            </Text>
                        </View>
                    </View>

                    {/* Caja con tamaño 500 en Desktop igual que el Register */}
                    <View style={[styles.caja, isDesktopView && { width: 500 }]}>
                        <Text style={[styles.mainText, { marginBottom: 20 }]}>Iniciar Sesión</Text>

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

                            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                                <Text style={styles.texto}>¿Has olvidado tu contraseña?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', marginTop: 30 }}>
                            <CustomButton 
                                title={isSubmitting ? "ENTRANDO..." : "INICIAR SESIÓN"} 
                                onPress={handleLogin} 
                            />
                        </View>

                        <TouchableOpacity 
                            onPress={() => navigation.navigate("Register")} 
                            style={{ marginTop: 25 }}
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

    // ------------------------------------------------------------
    // VERSIÓN MOBILE (Android / iOS)
    // ------------------------------------------------------------
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0e0d0df1' }}>
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
                            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                            <View style={styles.contenedorWritter}>
                                <Text style={styles.tituloHero}>
                                    {strings.nameMayus} <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                                </Text>
                            </View>
                        </View>

                        <View style={styles.caja}>
                            <Text style={[styles.mainText, { marginBottom: 25 }]}>Iniciar Sesión</Text>
                            
                            <View style={styles.formStack}>
                                <CustomInputText
                                    label="Email"
                                    placeholder="ejemplo@correo.com"
                                    onChangeText={setEmail}
                                    value={email}
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
                            
                            <View style={{ width: '100%', marginTop: 35 }}>
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