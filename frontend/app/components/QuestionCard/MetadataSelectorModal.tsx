import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../screens/stylesGlobal";

interface MetadataItem {
    id: number;
    name?: string;     
    genere?: string;   
    description?: string; 
}

interface Props {
    visible: boolean;
    title: string;
    items: MetadataItem[];
    selectedItems: MetadataItem[];
    onToggle: (item: any) => void;
    onClose: () => void;
}

export const MetadataSelectorModal = ({
    visible,
    title,
    items,
    selectedItems,
    onToggle,
    onClose,
}: Props) => {
    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Pressable fuera para cerrar al tocar el fondo oscuro */}
                <Pressable style={styles.dismissArea} onPress={onClose} />
                
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.iconClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView 
                        contentContainerStyle={styles.grid}
                        showsVerticalScrollIndicator={false}
                    >
                        {items.map((item) => {
                            const isSelected = selectedItems.some((s) => s.id === item.id);
                            const label = item.name || item.genere || item.description || "Sin nombre";

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.chip, 
                                        isSelected && styles.chipActive
                                    ]}
                                    onPress={() => onToggle(item)}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                        {label}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={14} color="#fff" style={{marginLeft: 6}} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TouchableOpacity 
                        style={styles.confirmBtn} 
                        onPress={onClose}
                    >
                        <Text style={styles.confirmBtnText}>Confirmar Selección</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dismissArea: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    content: {
        backgroundColor: "#121212", // Negro profundo
        borderRadius: 24,
        width: "100%",
        maxWidth: 500, // Para que no se vea gigante en Web
        maxHeight: "75%",
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    iconClose: {
        padding: 4,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 8,
        paddingBottom: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 100, // Estilo píldora
        backgroundColor: "#1e1e1e",
        borderWidth: 1,
        borderColor: "#333",
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        // Un poco de glow si es posible
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    chipText: { 
        color: "#999", 
        fontSize: 13,
        fontWeight: "600"
    },
    chipTextActive: { 
        color: "#fff", 
        fontWeight: "bold" 
    },
    confirmBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center',
    },
    confirmBtnText: { 
        color: "#fff", 
        fontWeight: "800", 
        fontSize: 15,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
});