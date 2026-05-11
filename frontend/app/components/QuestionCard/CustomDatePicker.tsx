import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
// Asumiendo que colors tiene: destaqueAzul, fondoCaja, bordes, etc.
import { colors } from "../../screens/stylesGlobal"; 

interface Props {
    label: string;
    value: string | undefined;
    onChange: (date: string) => void;
}

export const CustomDatePicker = ({ label, value, onChange }: Props) => {
    const [show, setShow] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // Para el efecto visual en Web

    // --- RENDER WEB ---
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <input
                    type="date"
                    value={value ? value.split("T")[0] : ""}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                        if (e.target.value) {
                            onChange(new Date(e.target.value).toISOString());
                        }
                    }}
                    style={{
                        backgroundColor: "#1a1a1a",
                        color: "#fff",
                        padding: "12px",
                        borderRadius: "8px",
                        border: `1px solid ${isFocused ? "#007AFF" : "#333"}`, // Cambio de color dinámico
                        width: "100%",
                        outline: "none",
                        fontSize: "14px",
                        transition: "border-color 0.2s ease-in-out", // Suavizado
                        fontFamily: "inherit"
                    }}
                />
            </View>
        );
    }

    // --- LÓGICA MOBILE ---
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios'); 
        if (selectedDate) {
            onChange(selectedDate.toISOString());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                    styles.dateButton, 
                    value ? { borderColor: "#007AFF" } : { borderColor: "#333" }
                ]} 
                onPress={() => setShow(true)}
            >
                <Text style={[styles.dateText, !value && { color: "#777" }]}>
                    {value ? new Date(value).toLocaleDateString() : "Seleccionar fecha"}
                </Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()} // No permite fechas futuras
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        marginBottom: 20,
        width: '100%' 
    },
    label: { 
        color: "#aaa", // Un gris suave para el label
        fontSize: 12, 
        fontWeight: "600", 
        marginBottom: 8, 
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    dateButton: { 
        backgroundColor: "#1a1a1a", 
        padding: 14, 
        borderRadius: 8, 
        borderWidth: 1, 
        // El color del borde lo manejamos dinámico en el componente
    },
    dateText: { 
        color: "#fff", 
        fontSize: 15 
    },
});