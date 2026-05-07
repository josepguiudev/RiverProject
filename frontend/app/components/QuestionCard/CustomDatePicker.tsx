import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { colors } from "../../screens/stylesGlobal";

interface Props {
    label: string;
    value: string | undefined;
    onChange: (date: string) => void;
}

export const CustomDatePicker = ({ label, value, onChange }: Props) => {
    const [show, setShow] = useState(false);

    // Si estamos en Web, usamos el input nativo de HTML5 porque el picker de RN no es compatible
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <input
                    type="date"
                    value={value ? value.split("T")[0] : ""}
                    onChange={(e) => onChange(new Date(e.target.value).toISOString())}
                    style={{
                        backgroundColor: "#1a1a1a",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #333",
                        width: "100%",
                        outline: "none"
                    }}
                />
            </View>
        );
    }

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios'); // En iOS no se cierra solo
        if (selectedDate) {
            onChange(selectedDate.toISOString());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShow(true)}>
                <Text style={styles.dateText}>
                    {value ? new Date(value).toLocaleDateString() : "Seleccionar fecha"}
                </Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 15 },
    label: { color: "#888", fontSize: 11, fontWeight: "bold", marginBottom: 8, textTransform: "uppercase" },
    dateButton: { backgroundColor: "#1a1a1a", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#333" },
    dateText: { color: "#fff", fontSize: 14 },
});