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
import styles, { colors } from "../stylesGlobal";
import { useLayout } from "@/app/utils/useLayout";
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
        const baseUrl = isWeb ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
        
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

            // Redirección según rol y paso de registro
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
            Alert.alert("Error de conexión", "Servidor no disponible");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ------------------------------------------------------------
    // VERSIÓN WEB
    // ------------------------------------------------------------
    if (isWeb) {
        return (
            <View style={styles.alineadoPersonal}>
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.contendorLogoTitulos, { marginBottom: 40 }]}>
                        <Image 
                            source={require("../../../assets/images/logo.png")} 
                            style={styles.logo}
                            resizeMode="contain"
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

                            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                                <Text style={[styles.textoChico, { color: colors.secondary }]}>
                                    ¿Has olvidado tu contraseña?
                                </Text>
                            </TouchableOpacity>
                            
                            <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <CustomButton 
                                    title={isSubmitting ? "Entrando..." : strings.login} 
                                    onPress={handleLogin} 
                                    disabled={isSubmitting}
                                />
                            </View>

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
                    
                    <Text style={[styles.textoChico, { marginTop: 40, opacity: 0.5, textAlign: 'center' }]}>
                        River Project © 2024 - Todos los derechos reservados
                    </Text>
                </ScrollView>
            </View>
        );
    }

    // ------------------------------------------------------------
    // VERSIÓN ANDROID
    // ------------------------------------------------------------
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
                    bounces={false}
                >
                    <View style={[styles.alineadoPersonal, { flex: 0, paddingVertical: 40 }]}>
                        <View style={styles.contendorLogoTitulos}>
                            <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
                            <View style={styles.contenedorWritter}>
                                <Text style={styles.tituloHero}>
                                    {strings.nameMayus}{" "}
                                    <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                                </Text>
                            </View>
                        </View>

                        <View style={styles.caja}>
                            <Text style={[styles.mainText, { marginBottom: 30, color: colors.white }]}>Iniciar Sesión</Text>
                            
                            <View style={{ width: '100%' }}>
                                <CustomInputText
                                    label={strings.direccionEmail}
                                    placeholder={strings.placeEmail}
                                    onChangeText={setEmail}
                                    value={email}
                                />
                                <View style={styles.margen2}>
                                    <CustomInputText
                                        label={strings.contrasenia}
                                        placeholder={strings.placePassword}
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        value={password}
                                    />
                                </View>
                                
                                <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center' }}>
                                    <CustomButton 
                                        title={isSubmitting ? "Entrando..." : strings.login} 
                                        onPress={handleLogin} 
                                        disabled={isSubmitting}
                                    />
                                </View>

                                <TouchableOpacity 
                                    onPress={() => navigation.navigate("Register")} 
                                    style={{ marginTop: 25, alignItems: 'center', paddingVertical: 10 }}
                                >
                                    <Text style={styles.texto}>
                                        ¿No tienes cuenta? <Text style={styles.blueText}>Regístrate aquí</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}