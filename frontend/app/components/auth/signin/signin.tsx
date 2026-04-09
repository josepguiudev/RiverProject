import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Modal,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { useResponsive } from "../../../utils/useResponsive";
import { API_CONFIG } from "../../../config/api.config";

interface SignInProps {
    isVisible: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    navigation: any;
}

export default function SignIn({
    isVisible,
    onClose,
    onSwitchToRegister,
    navigation,
}: SignInProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Obtenemos si es Desktop en tiempo real
    const { isDesktop } = useResponsive();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Ingresa tus credenciales");
            return;
        }

        setLoading(true);
        try {
            // USAMOS LA BASE_URL DINÁMICA (localhost para web, 10.0.2.2 para Android)
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("token", data.token);
                onClose();
                navigation.replace("SurveyList");
            } else {
                Alert.alert(
                    "Error",
                    data.message || "Credenciales incorrectas"
                );
            }
        } catch (error) {
            Alert.alert(
                "Error de conexión",
                "No se pudo contactar con el servidor. Revisa tu conexión o el backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlayContainer}
            >
                <View style={styles.darkBackground}>
                    <ScrollView 
                        contentContainerStyle={[
                            styles.scrollContainer,
                            // Si es Desktop, centramos el contenido en pantalla completa
                            isDesktop && { justifyContent: 'center', alignItems: 'center', flex: 1 }
                        ]}
                    >
                        <View style={[
                            styles.formCard,
                            // Ajustamos el ancho si es Desktop para que no se vea estirado
                            isDesktop && { width: 450, maxWidth: '100%', alignSelf: 'center' }
                        ]}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                            
                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>River Project</Text>
                                <Text style={styles.subtitle}>
                                    Inicia sesión para continuar
                                </Text>
                            </View>

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="tu@correo.com"
                                placeholderTextColor="#546E7A"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#546E7A"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    loading && styles.buttonDisabled,
                                ]}
                                onPress={handleSignIn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#1D2735" />
                                ) : (
                                    <Text style={styles.buttonText}>Acceder</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.footerLink}
                                onPress={onSwitchToRegister}
                            >
                                <Text style={styles.linkText}>
                                    ¿No tienes cuenta?{" "}
                                    <Text style={styles.linkTextBold}>Regístrate</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}