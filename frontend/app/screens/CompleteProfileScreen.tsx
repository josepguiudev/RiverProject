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
    Platform,
} from "react-native";
import { useAuth } from "./Auth/AuthContext";
import client from "../api/client";
import { CustomDatePicker } from "../components/QuestionCard/CustomDatePicker";
import styles, { colors } from "./stylesGlobal";



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
        <View style={localStyles.inputContainer}>
            {label && <Text style={styles.labelCustom}>{label}</Text>}

            <View style={localStyles.inputWrapper}>
                <TextInput
                    style={[
                        localStyles.input,
                        {
                            fontSize: isAdmin ? 12 : 16,
                            paddingVertical: isAdmin ? 8 : 12,
                        },
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
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
                styles.botonGrande,
                {
                    paddingVertical: isAdmin ? 8 : 16,
                    width: isAdmin ? "33%" : "100%", // Se adapta al contenedor max-width de la caja
                    backgroundColor: colors.primary,
                },
                disabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={colors.white} />
            ) : (
                <Text style={[styles.textoBotonGrande, { fontSize: isAdmin ? 12 : 16 }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
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
            style={styles.alineadoPersonal}
            contentContainerStyle={[
                styles.scrollContainer,
                {
                    paddingVertical: 40,
                    alignItems: "center",
                    justifyContent: "center",
                },
            ]}
        >
            <View style={[styles.caja, styles.cajaDesktop]}>
                <Text style={styles.tituloHero}>
                        Paso 2:{" "}
                        <Text style={styles.destaqueAzul}>Completa tu Perfil</Text>
                    </Text>
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
                        { marginTop: 20, marginBottom: 10, color: colors.textSecondary, fontWeight: "600" },
                    ]}
                >
                    Género
                </Text>
                
                <View style={localStyles.generoGrid}>
                    {generoOptions.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() =>
                                setFormData({ ...formData, genero: opt.value })
                            }
                            style={[
                                localStyles.generoItem,
                                {
                                    backgroundColor:
                                        formData.genero === opt.value
                                            ? colors.primary
                                            : colors.background,
                                    borderColor:
                                        formData.genero === opt.value
                                            ? colors.primary
                                            : colors.border,
                                },
                            ]}
                        >
                            <Text style={localStyles.generoTexto}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <CustomInputText
                    label="Ciudad / País"
                    placeholder="Ej: Madrid, España"
                    onChangeText={(t) =>
                        setFormData({ ...formData, localizacion: t })
                    }
                />

                <View style={localStyles.btnWrapper}>
                    <CustomButton
                        title="CONTINUAR AL PASO FINAL"
                        onPress={handleNextStep}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

// Estilos específicos locales que no existían en tu hoja global pero usan tus variables de color
const localStyles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    labelCustom: { // Solución al Error de TypeScript de 'labelCustom'
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 5,
        fontWeight: "600",
    },
    inputWrapper: {
        width: "100%",
        backgroundColor: colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        color: colors.text,
        paddingHorizontal: 12,
    },
    disabled: { // Solución al Error de TypeScript de 'disabled'
        opacity: 0.5,
    },
    generoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
        width: "100%",
    },
    generoItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        minWidth: "47%",
        flexGrow: 1,
        borderWidth: 1,
        alignItems: "center",
    },
    generoTexto: {
        color: colors.textMain,
        fontWeight: "bold",
    },
    btnWrapper: {
        marginTop: 25,
        alignItems: "center",
        width: "100%",
    },
});

// Agregado dinámico por si acaso no está definido en tus estilos globales
if (!(styles as any).labelCustom) {
    Object.assign(styles, {
        labelCustom: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 5,
            fontWeight: "600",
        }
    });
}