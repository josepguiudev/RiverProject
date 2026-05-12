import React, { useState } from "react";
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./Auth/AuthContext"; 
import client from "../api/client";
import CustomInputText from "../components/CustomInputText/CustomInputText";
import CustomButton from "../components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";

/**
 * Pantalla final de onboarding: Conexión con Steam.
 * Permite al usuario vincular su Steam ID para que el sistema le asigne encuestas basadas en sus juegos.
 */
export default function ConnectSteamScreen({ navigation }: any) {
    // Extraemos los datos del usuario y la función para finalizar el onboarding
    const { user, updateRegistrationStep } = useAuth(); 
    const [steamId, setSteamId] = useState("");
    const [loading, setLoading] = useState(false);

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    /**
     * Envía el Steam ID al backend para finalizar el registro.
     * Si la validación es correcta, marca el onboarding como completado.
     */
    const handleFinalize = async () => {
        if (!steamId) {
            Alert.alert("Error", "Por favor, introduce tu Steam ID.");
            return;
        }

        setLoading(true);
        try {
            // Usamos el cliente centralizado
            const response = await client.put(`/api/auth2/complete-profile-steam/${user?.id}?steamId=${steamId}`);

            if (response.status === 200) {
                Alert.alert("¡Configuración Completa!", "Hemos analizado tu perfil y asignado las encuestas disponibles.");
                // Actualizamos el paso de registro a 3 (Completado)
                await updateRegistrationStep(3);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data || "No se pudo validar el Steam ID.";
            Alert.alert("Error", typeof errorMsg === 'string' ? errorMsg : "Error en el registro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            style={[styles.alineadoPersonal, { flex: 1 }]} 
            contentContainerStyle={[styles.scrollContainer, { justifyContent: 'center', padding: 20 }]}
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

                <View style={{ marginTop: 30, gap: 12, alignItems: 'center' }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <CustomButton title="VINCULAR Y ASIGNAR ENCUESTAS" onPress={handleFinalize} />
                            
                            {/* BOTÓN DE TEST PARA DESARROLLO */}
                            <TouchableOpacity 
                                style={[styles.btnSecondary, { borderStyle: 'solid', marginTop: 10 }]} 
                                onPress={async () => {
                                    await updateRegistrationStep(3);
                                    // App.tsx hará el cambio automáticamente
                                }} 
                            >
                                <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                                    DEBUG: SALTAR A ENCUESTAS (PERSISTENTE)
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