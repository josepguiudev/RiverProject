import React, { useState } from "react";
import {
	View,
	Text,
	Alert,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { useAuth } from "./Auth/AuthContext";
import client from "../api/client";
import CustomInputText from "../components/CustomInputText/CustomInputText";
import CustomButton from "../components/CustomButton/CustomButton";
import styles, { colors } from "./stylesGlobal";
import Constants from "expo-constants";

/**
 * Pantalla final de onboarding: Conexión con Steam.
 * Permite al usuario vincular su Steam ID para que el sistema le asigne encuestas basadas en sus juegos.
 */
export default function ConnectSteamScreen() {
	// Extraemos los datos del usuario y la función para finalizar el onboarding
	const { user, updateRegistrationStep } = useAuth();
	const [steamId, setSteamId] = useState("");
	const [loading, setLoading] = useState(false);

	/**
	 * Envía el Steam ID al backend para finalizar el registro.
	 * Si la validación es correcta, marca el onboarding como completado.
	 */
	const handleFinalize = async () => {
		if (!steamId.trim()) {
			Alert.alert("Error", "Por favor, introduce tu Steam ID.");
			return;
		}

		const steamIdRegex = /^[0-9]{17}$/;
		if (!steamIdRegex.test(steamId.trim())) {
			Alert.alert(
				"Error",
				"El Steam ID debe tener exactamente 17 dígitos numéricos.",
			);
			return;
		}

		setLoading(true);
		try {
			// Buscamos la clave en el objeto 'extra' definido en app.config.js
			const apiKey = Constants.expoConfig?.extra?.STEAM_API_KEY;

			if (!apiKey) {
				console.error("No se encontró STEAM_API_KEY en app.config.js");
			}

			// Usamos la instancia de client para no lidiar con tokens manuales ni URLs dinámicas
			const res = await client.put(
				`/api/auth2/complete-profile-steam/${user?.id}`,
				null,
				{
					params: {
						steamId: steamId.trim(),
						steamApiKey: apiKey,
					},
				},
			);

			if (res.status === 200) {
				Alert.alert(
					"¡Configuración Completa!",
					"Perfil vinculado correctamente.",
				);
				await updateRegistrationStep(3); // El enrutamiento condicional cambia de vista automáticamente
			}
		} catch (error: any) {
			console.error("Error en conexión:", error);
			const errorMsg =
				error.response?.data || "No se pudo validar el Steam ID.";
			Alert.alert(
				"Error",
				typeof errorMsg === "string"
					? errorMsg
					: "Error de conexión con el servidor.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView
			style={[styles.alineadoPersonal, { flex: 1 }]}
			contentContainerStyle={[
				styles.scrollContainer,
				{ justifyContent: "center", padding: 20 },
			]}
		>
			<View style={styles.cajaDesktop}>
				<Text style={styles.tituloHero}>
					Paso Final:{" "}
					<Text style={styles.destaqueAzul}>Conecta Steam</Text>
				</Text>

				<Text
					style={[
						styles.textoChico,
						{ marginVertical: 20, lineHeight: 20 },
					]}
				>
					Al vincular tu ID, nuestro sistema te asignará
					automáticamente todas las encuestas de los juegos que ya
					tienes en tu biblioteca.
				</Text>

				<CustomInputText
					label="Steam ID (64 bits)"
					placeholder="Ej: 76XXXXXXXXXXXXXX"
					keyboardType="numeric"
					maxLength={17}
					value={steamId}
					onChangeText={setSteamId}
				/>

				<View style={{ marginTop: 30, gap: 12, alignItems: "center" }}>
					{loading ? (
						<ActivityIndicator
							size="large"
							color={colors.primary}
						/>
					) : (
						<>
							<CustomButton
								title="VINCULAR Y ASIGNAR ENCUESTAS"
								onPress={handleFinalize}
							/>

							{/* BOTÓN DE TEST PARA DESARROLLO */}
							<TouchableOpacity
								style={[
									styles.btnSecondary,
									{ borderStyle: "solid", marginTop: 10 },
								]}
								onPress={async () => {
									await updateRegistrationStep(3);
								}}
							>
								<Text
									style={{
										color: colors.text,
										fontWeight: "bold",
									}}
								>
									DEBUG: SALTAR A ENCUESTAS (PERSISTENTE)
								</Text>
							</TouchableOpacity>
						</>
					)}
				</View>

				<TouchableOpacity
					onPress={() =>
						Alert.alert(
							"Ayuda",
							"Tu SteamID64 es un número único. Puedes obtenerlo en steamid.io pegando el link de tu perfil.",
						)
					}
					style={{ marginTop: 25 }}
				>
					<Text
						style={[
							styles.textoChico,
							{
								textAlign: "center",
								textDecorationLine: "underline",
								opacity: 0.7,
							},
						]}
					>
						¿Dónde encuentro mi Steam ID?
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
