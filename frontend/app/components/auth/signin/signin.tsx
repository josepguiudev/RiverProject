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

interface SignInProps {
	isVisible: boolean;
	onClose: () => void;
	onSwitchToRegister: () => void;
	navigation: any; // <--- Agregado para TS
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

	const handleSignIn = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Ingresa tus credenciales");
			return;
		}

		setLoading(true);
		try {
			// 10.0.2.2 es la IP para el emulador de Android
			const response = await fetch(
				"http://localhost:8080/api/auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await response.json();

			if (response.ok) {
				await AsyncStorage.setItem("token", data.token);
				onClose();
				navigation.replace("SurveyList"); // <--- Navegación directa
			} else {
				Alert.alert(
					"Error",
					data.message || "Credenciales incorrectas",
				);
			}
		} catch (error) {
			Alert.alert(
				"Error de conexión",
				"No se pudo contactar con el servidor.",
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
					<ScrollView contentContainerStyle={styles.scrollContainer}>
						<View style={styles.formCard}>
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
									<Text style={styles.buttonText}>
										Acceder
									</Text>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.footerLink}
								onPress={onSwitchToRegister}
							>
								<Text style={styles.linkText}>
									¿No tienes cuenta?{" "}
									<Text style={styles.linkTextBold}>
										Regístrate
									</Text>
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
