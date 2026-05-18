import React, { useState } from "react";
import { View, Text, Alert, Platform, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "./Auth/AuthContext"; 
import client from "../api/client";
import CustomInputText from "../components/CustomInputText/CustomInputText";
import CustomButton from "../components/CustomButton/CustomButton";
import {
  View,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "./Auth/AuthContext";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";
import Constants from "expo-constants";
import { isWeb } from "../utils/device";

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
      const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY;
      if (!apiKey) {
        console.error("No se encontró STEAM_API_KEY en app.config.js");
      }

      const url = `${baseUrl}/api/auth2/complete-profile-steam/${user?.id}?steamId=${steamId}&steamApiKey=${apiKey}`;
      console.log("Enviando a:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

  // ============================================================
  //  VERSIÓN WEB (exactamente igual al original)
  // ============================================================
  if (isWeb) {
    return (
      <ScrollView
        style={styles.alineadoPersonal}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
      >
        <View style={styles.cajaDesktop}>
          <Text style={styles.tituloHero}>
            Paso Final: <Text style={styles.destaqueAzul}>Conecta Steam</Text>
          </Text>

          <Text style={[styles.textoChico, { marginVertical: 20, lineHeight: 20 }]}>
            Al vincular tu ID, nuestro sistema te asignará automáticamente todas las encuestas
            de los juegos que ya tienes en tu biblioteca.
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

                <TouchableOpacity
                  style={[styles.btnSecondary, { borderStyle: "solid", marginTop: 10 }]}
                  onPress={() => navigation.navigate("SurveyList")}
                >
                  <Text style={{ color: colors.text, fontWeight: "bold" }}>
                    DEBUG: SALTAR A ENCUESTAS (TEST)
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Ayuda",
                "Tu SteamID64 es un número único. Puedes obtenerlo en steamid.io pegando el link de tu perfil."
              )
            }
            style={{ marginTop: 25 }}
          >
            <Text
              style={[
                styles.textoChico,
                { textAlign: "center", textDecorationLine: "underline", opacity: 0.7 },
              ]}
            >
              ¿Dónde encuentro mi Steam ID?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil, optimizado para móvil)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 34, fontWeight: "bold", color: colors.white, textAlign: "center", marginBottom: 16 }}>
          Paso Final:{" "}
          <Text style={{ color: colors.secondary }}>Conecta Steam</Text>
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 22,
          }}
    return (
        <ScrollView 
            style={[styles.alineadoPersonal, { flex: 1 }]} 
            contentContainerStyle={[styles.scrollContainer, { justifyContent: 'center', padding: 20 }]}
        >
          Al vincular tu ID, nuestro sistema te asignará automáticamente todas las encuestas
          de los juegos que ya tienes en tu biblioteca.
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
                onPress={() => navigation.navigate("SurveyList")}
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 1.5,
                  borderColor: colors.primary,
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 16 }}>
                  DEBUG: SALTAR A ENCUESTAS (TEST)
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Ayuda",
              "Tu SteamID64 es un número único. Puedes obtenerlo en steamid.io pegando el link de tu perfil."
            )
          }
          style={{ marginTop: 32 }}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: "center",
              textDecorationLine: "underline",
              opacity: 0.7,
            }}
          >
            ¿Dónde encuentro mi Steam ID?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}