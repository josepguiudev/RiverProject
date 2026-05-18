import React, { useState } from "react";
import {
	View,
	Text,
	Alert,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	TextInputProps,
	ActivityIndicator,
} from "react-native";
import { useAuth } from "./Auth/AuthContext";
import client from "../api/client";
import { CustomDatePicker } from "../components/QuestionCard/CustomDatePicker";

interface InputProps extends TextInputProps {
	label?: string;
	placeholder: string;
	isAdmin?: boolean;
	onChangeText?: (text: string) => void;
}

const CustomInputText = ({
	label,
	placeholder,
	isAdmin = false,
	...props
}: InputProps) => {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}

			<View style={styles.inputWrapper}>
				<TextInput
					style={[
						styles.input,
						{
							fontSize: isAdmin ? 12 : 16,
							paddingVertical: isAdmin ? 8 : 12,
						},
					]}
					placeholder={placeholder}
					placeholderTextColor="#666"
					underlineColorAndroid="transparent"
					{...props}
				/>
			</View>
		</View>
	);
};

type ButtonProps = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	loading?: boolean;
	isAdmin?: boolean;
};

const CustomButton = ({
	title,
	onPress,
	disabled = false,
	loading = false,
	isAdmin = false,
}: ButtonProps) => {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				{
					paddingVertical: isAdmin ? 4 : 14,
					width: isAdmin ? "33%" : "50%",
				},
				disabled && styles.disabled,
			]}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator color="#fff" />
			) : (
				<Text style={[styles.text, { fontSize: isAdmin ? 10 : 16 }]}>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
};

const colors = {
	background: "#0F172A",
	primary: "#3B82F6",
};

export default function CompleteProfileScreen({ navigation }: any) {
	const { user, updateRegistrationStep } = useAuth();

	const [formData, setFormData] = useState({
		apellido1: "",
		apellido2: "",
		fechaNacimiento: "",
		genero: 0,
		localizacion: "",
	});

	const generoOptions = [
		{ label: "Masculino", value: 0 },
		{ label: "Femenino", value: 1 },
		{ label: "No Binario", value: 2 },
		{ label: "Otros", value: 3 },
	];

	const calculateAge = (birthdayStr: string) => {
		if (!birthdayStr) return null;
		const birthday = new Date(birthdayStr);
		if (isNaN(birthday.getTime())) return null;

		const today = new Date();
		let age = today.getFullYear() - birthday.getFullYear();
		const m = today.getMonth() - birthday.getMonth();

		if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
			age--;
		}
		return age;
	};

	const handleNextStep = async () => {
		if (
			!formData.apellido1 ||
			!formData.fechaNacimiento ||
			!formData.localizacion
		) {
			Alert.alert(
				"Error",
				"Por favor, completa los campos obligatorios.",
			);
			return;
		}

		const edadCalculada = calculateAge(formData.fechaNacimiento);

		if (edadCalculada === null) {
			Alert.alert("Error", "Fecha de nacimiento inválida.");
			return;
		}

		if (edadCalculada < 13) {
			Alert.alert("Aviso", "Debes ser mayor de 13 años para continuar.");
			return;
		}

		const body = {
			apellido1: formData.apellido1,
			apellido2: formData.apellido2,
			genero: formData.genero,
			localizacion: formData.localizacion,
			fechaNacimiento: formData.fechaNacimiento,
			edad: edadCalculada,
		};

		try {
			const res = await client.put(
				`/api/auth2/complete-profile/${user?.id}`,
				body,
			);

			if (res.status === 200) {
				await updateRegistrationStep(2);
			}
		} catch (error: any) {
			const errorMsg =
				error.response?.data || "Error de conexión con el servidor.";
			Alert.alert(
				"Error",
				typeof errorMsg === "string"
					? errorMsg
					: "No se pudo guardar la información.",
			);
		}
	};

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: colors.background }}
			contentContainerStyle={[
				styles.scrollContainer,
				{
					paddingVertical: 40,
					alignItems: "center",
					justifyContent: "center",
				},
			]}
		>
			<View
				style={[
					styles.cajaDesktop,
					{ alignSelf: "center", width: "100%", maxWidth: 500 },
				]}
			>
				<Text style={styles.mainText}>Paso 2: Completa tu Perfil</Text>

				<CustomInputText
					label="Primer Apellido"
					placeholder="Tu primer apellido"
					onChangeText={(t) =>
						setFormData({ ...formData, apellido1: t })
					}
				/>

				<CustomInputText
					label="Segundo Apellido (Opcional)"
					placeholder="Tu segundo apellido"
					onChangeText={(t) =>
						setFormData({ ...formData, apellido2: t })
					}
				/>

				<CustomDatePicker
					label="Fecha de Nacimiento"
					value={formData.fechaNacimiento}
					onChange={(val) =>
						setFormData({ ...formData, fechaNacimiento: val })
					}
				/>

				<Text
					style={[
						styles.texto,
						{ marginTop: 15, marginBottom: 10, color: "#aaa" },
					]}
				>
					Género
				</Text>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 10,
						marginBottom: 20,
					}}
				>
					{generoOptions.map((opt) => (
						<TouchableOpacity
							key={opt.value}
							onPress={() =>
								setFormData({ ...formData, genero: opt.value })
							}
							style={{
								paddingVertical: 12,
								paddingHorizontal: 15,
								borderRadius: 8,
								minWidth: "47%",
								backgroundColor:
									formData.genero === opt.value
										? colors.primary
										: "#1a1a1a",
								borderWidth: 1,
								borderColor:
									formData.genero === opt.value
										? colors.primary
										: "#333",
								alignItems: "center",
							}}
						>
							<Text
								style={{ color: "white", fontWeight: "bold" }}
							>
								{opt.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<CustomInputText
					label="Ciudad / Pais"
					placeholder="Ej: Madrid, España"
					onChangeText={(t) =>
						setFormData({ ...formData, localizacion: t })
					}
				/>

				<View style={{ marginTop: 20, alignItems: "center" }}>
					<CustomButton
						title="CONTINUAR AL PASO FINAL"
						onPress={handleNextStep}
					/>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		width: "100%",
	},
	cajaDesktop: {
		backgroundColor: "#1E293B",
		borderRadius: 12,
		padding: 24,
		borderWidth: 1,
		borderColor: "#334155",
	},
	mainText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 20,
		textAlign: "center",
	},
	texto: {
		fontSize: 14,
		fontWeight: "600",
	},
	container: {
		width: "100%",
		marginBottom: 15,
	},
	label: {
		fontSize: 14,
		color: "#aaa",
		marginBottom: 5,
		fontWeight: "600",
	},
	inputWrapper: {
		width: "100%",
		backgroundColor: "#1a1a1a",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#333",
	},
	input: {
		color: "white",
		paddingHorizontal: 12,
	},
	button: {
		backgroundColor: colors.primary,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "white",
		fontWeight: "bold",
	},
	disabled: {
		opacity: 0.5,
	},
});
