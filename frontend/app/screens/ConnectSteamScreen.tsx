import React, { useState } from "react";
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useAuth } from "./Auth/AuthContext"; // Importante para el token
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import styles from "./stylesGlobal";

export default function ConnectSteamScreen({ navigation }: any) {
    // ERROR 1 SOLUCIONADO: Extraemos 'token' y 'user' del hook useAuth
    const { user, token } = useAuth(); 
    
    const [steamId, setSteamId] = useState("");
    
    // ERROR 3 SOLUCIONADO: Unificamos el nombre a 'loading' para que coincida con el error de TS
    const [loading, setLoading] = useState(false);

    const baseUrl = Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";

    // ERROR 2 SOLUCIONADO: Definimos la función que guarda la conexión
    const handleFinalize = async () => {
        if (!steamId) {
            Alert.alert("Error", "Por favor, introduce tu Steam ID.");
            return;
        }

        setLoading(true);
        try {
            // Llamamos al paso 3 del backend (complete-steam-registration)
            const response = await fetch(`${baseUrl}/api/auth2/complete-profile-steam/${user?.id}?steamId=${steamId}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`, // Usamos el token aquí
                    "Content-Type": "application/json" 
                }
            });

            if (response.ok) {
                Alert.alert("¡Éxito!", "Cuenta vinculada y encuestas asignadas.");
                // Una vez terminado el flujo, lo mandamos al Home o Dashboard
                navigation.replace("Home"); 
            } else {
                const errorMsg = await response.text();
                Alert.alert("Error", errorMsg || "No se pudo validar el Steam ID.");
            }
        } catch (error) {
            Alert.alert("Error", "Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#0e0d0df1', padding: 20 }}>
            <View style={[styles.caja, { alignSelf: 'center', width: '100%', maxWidth: 500 }]}>
                <Text style={styles.mainText}>Paso Final: Conecta Steam</Text>
                
                <Text style={[styles.texto, { marginBottom: 20, color: '#ccc' }]}>
                    Para personalizar tu experiencia, necesitamos tu SteamID64 (el número de 17 dígitos). 
                    Esto nos permitirá asignarte encuestas basadas en tus juegos.
                </Text>

                <CustomInputText 
                    label="Steam ID (64 bits)" 
                    placeholder="Ej: 76XXXXXXXXXXXXXX" 
                    value={steamId}
                    onChangeText={setSteamId} 
                />

                <View style={{ marginTop: 30 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : (
                        <CustomButton title="VINCULAR Y FINALIZAR" onPress={handleFinalize} />
                    )}
                </View>

                <Text 
                    style={{ color: '#555', fontSize: 12, marginTop: 15, textAlign: 'center' }}
                    onPress={() => Alert.alert("Ayuda", "Puedes encontrar tu ID en la configuración de tu perfil de Steam o en webs como steamid.io")}
                >
                    ¿Dónde encuentro mi Steam ID?
                </Text>
            </View>
        </ScrollView>
    );
}