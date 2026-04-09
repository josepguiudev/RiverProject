import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Platform, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView } from "react-native";
import TypeWriter from "react-native-typewriter";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import strings from "../../../assets/supportFiles/strings.json";
import styles, {colors} from "../stylesGlobal"; // Tu archivo de estilos unificado
import { useLayout } from "@/app/utils/useLayout";
import { useAuth } from "../Auth/AuthContext"; 
import { isWeb } from "@/app/utils/device";

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
        let baseUrl = null;
        if (isWeb){
            baseUrl = 'http://localhost:8080';
        }else{
            baseUrl = 'http://10.0.2.2:8080'
        }
        
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

    if (isWeb){
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
                        
                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
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
    } else {
        return (    
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <KeyboardAvoidingView 
                    style={{ flex: 1 }} 
                    /* En iOS 'padding' funciona excelente. En Android, suele ser mejor no definirlo 
                       o usar 'height' solo si no tienes ScrollView. Al dejarlo indefinido en Android, 
                       el sistema nativo maneja el paneo automáticamente. */
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView 
                        /* flexGrow: 1 permite que el contenido se centre, pero crezca si el teclado lo empuja */
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        bounces={false} /* Evita el rebote molesto en iOS cuando no hay mucho contenido */
                    >
                        {/* Anulamos el flex: 1 de alineadoPersonal para que el ScrollView tome el control vertical
                            y le damos un padding vertical para que no se pegue a los bordes en pantallas muy pequeñas */ }
                        <View style={[styles.alineadoPersonal, { flex: 0, paddingVertical: 40 }]}>
                            
                            {/* Header con Logo y Título Animado */}
                            <View style={styles.contendorLogoTitulos}>
                                <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
                                <View style={styles.contenedorWritter}>
                                    <Text style={styles.tituloHero}>
                                        {strings.nameMayus}{" "}
                                        <TypeWriter typing={1} style={styles.destaqueAzul}>{strings.appMayus}</TypeWriter>
                                    </Text>
                                </View>
                            </View>

                            {/* Caja de Login */}
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
    
}