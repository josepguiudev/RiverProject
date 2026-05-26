import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../screens/stylesGlobal"; 

interface Props {
    label: string;
    value: string | undefined;
    onChange: (date: string) => void;
}

export const CustomDatePicker = ({ label, value, onChange }: Props) => {
    const [show, setShow] = useState(false);
    const dateInputRef = useRef<any>(null);

    // --- MANEJADOR WEB ---
    const handlePressWeb = () => {
        if (Platform.OS === 'web' && dateInputRef.current) {
            // Esto abre el selector nativo en Chrome/Edge/Safari/Firefox
            if ('showPicker' in HTMLInputElement.prototype) {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.focus();
            }
        }
    };

    // --- MANEJADOR MOBILE ---
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
                activeOpacity={0.8}
                style={[
                    styles.dateButton, 
                    value ? { borderColor: colors.primary } : { borderColor: "#333" }
                ]} 
                onPress={Platform.OS === 'web' ? handlePressWeb : () => setShow(true)}
            >
                {/* Input invisible para Web que se activa al pulsar el botón */}
                {Platform.OS === 'web' && (
                    <input
                        ref={dateInputRef}
                        type="date"
                        style={styles.hiddenWebInput}
                        value={value ? value.split("T")[0] : ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                onChange(new Date(e.target.value).toISOString());
                            }
                        }}
                    />
                )}

                <View style={styles.content}>
                    <Text style={[styles.dateText, !value && { color: "#555" }]}>
                        {value ? new Date(value).toLocaleDateString() : "Seleccionar fecha"}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={value ? colors.primary : "#555"} />
                </View>
            </TouchableOpacity>

            {/* Selector Nativo Mobile */}
            {show && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    themeVariant="dark"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        marginBottom: 18,
        width: '100%' 
    },
    label: { 
        color: colors.textSecondary || "#888", 
        fontSize: 11, 
        fontWeight: "800", 
        marginBottom: 8, 
        textTransform: "uppercase",
        letterSpacing: 0.8
    },
    dateButton: { 
        backgroundColor: "#000", 
        padding: 14, 
        borderRadius: 12, 
        borderWidth: 1,
        position: 'relative', // Importante para posicionar el input oculto
    },
    content: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 1 // Por encima del input oculto
    },
    dateText: { 
        color: "#fff", 
        fontSize: 14,
        fontWeight: '500'
    },
    // Estilo para que el input web sea invisible pero clickable
    hiddenWebInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        zIndex: 0
    }
});