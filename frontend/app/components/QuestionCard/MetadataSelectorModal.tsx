import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { colors } from "../../screens/stylesGlobal";

interface MetadataItem {
    id: number;
    name?: string;     // Para Categorías
    genere?: string;   // Para Géneros
    description?: string; // Por si acaso
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
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    
                    <ScrollView contentContainerStyle={styles.grid}>
                        {items.map((item) => {
                            const isSelected = selectedItems.some((s) => s.id === item.id);
                            // Intentamos obtener el nombre de cualquier propiedad posible
                            const label = item.name || item.genere || item.description || "Sin nombre";

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.chip, isSelected && styles.chipActive]}
                                    onPress={() => onToggle(item)}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeBtnText}>Confirmar Selección</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        backgroundColor: "#1a1a1a",
        borderRadius: 20,
        width: "100%",
        maxHeight: "80%",
        padding: 20,
        borderWidth: 1,
        borderColor: "#333",
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
    },
    chip: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#262626",
        borderWidth: 1,
        borderColor: "#444",
        marginBottom: 5,
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: { color: "#ccc", fontSize: 13 },
    chipTextActive: { color: "#fff", fontWeight: "bold" },
    closeBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    closeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});