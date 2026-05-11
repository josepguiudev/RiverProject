import React, { useState } from "react";
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./Auth/AuthContext"; 
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";
import Constants from 'expo-constants';

export default function ConnectSteamScreen({ navigation }: any) {
    const { user, token } = useAuth(); 
    const [steamId, setSteamId] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    const handleFinalize = async () => {
        if (!steamId) {
            Alert.alert("Error", "Por favor, introduce tu Steam ID.");
            return;
        }

        setLoading(true);
        try {
            // Buscamos la clave en el objeto 'extra' que definiste en app.config.js
            const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY;

            if (!apiKey) {
                console.error("No se encontró STEAM_API_KEY en app.config.js");
            }

            const url = `${baseUrl}/api/auth2/complete-profile-steam/${user?.id}?steamId=${steamId}&steamApiKey=${apiKey}`;

            console.log("Enviando a:", url);

            const response = await fetch(url, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                }
            });

            if (response.ok) {
                Alert.alert("¡Configuración Completa!", "Perfil vinculado correctamente.");
                navigation.replace("SurveyList"); 
            } else {
                const errorMsg = await response.text();
                Alert.alert("Error", errorMsg || "No se pudo validar el Steam ID.");
            }
        } catch (error) {
            console.error("Error en conexión:", error);
            Alert.alert("Error", "Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            style={styles.alineadoPersonal} 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        >
            <View style={styles.cajaDesktop}>
                <Text style={styles.tituloHero}>
                    Paso Final: <Text style={styles.destaqueAzul}>Conecta Steam</Text>
                </Text>
                
                <Text style={[styles.textoChico, { marginVertical: 20, lineHeight: 20 }]}>
                    Al vincular tu ID, nuestro sistema te asignará automáticamente todas las encuestas de los juegos que ya tienes en tu biblioteca.
                </Text>

                <CustomInputText 
                    label="Steam ID (64 bits)" 
                    placeholder="Ej: 76XXXXXXXXXXXXXX" 
                    value={steamId}
                    onChangeText={setSteamId} 
                />

                <View style={{ marginTop: 30, gap: 12 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <CustomButton title="VINCULAR Y ASIGNAR ENCUESTAS" onPress={handleFinalize} />
                            
                            {/* BOTÓN DE TEST PARA DESARROLLO */}
                            <TouchableOpacity 
                                style={[styles.btnSecondary, { borderStyle: 'solid', marginTop: 10 }]} 
                                onPress={() => navigation.navigate("SurveyList")} 
                            >
                                <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                                    DEBUG: SALTAR A ENCUESTAS (TEST)
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <TouchableOpacity 
                    onPress={() => Alert.alert("Ayuda", "Tu SteamID64 es un número único. Puedes obtenerlo en steamid.io pegando el link de tu perfil.")}
                    style={{ marginTop: 25 }}
                >
                    <Text style={[styles.textoChico, { textAlign: 'center', textDecorationLine: 'underline', opacity: 0.7 }]}>
                        ¿Dónde encuentro mi Steam ID?
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}