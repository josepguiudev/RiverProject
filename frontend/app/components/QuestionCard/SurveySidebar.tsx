import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Category, Genere, Survey } from "../../types/formsSurvey.types";
import { colors } from "../../screens/stylesGlobal";
import { MetadataSelectorModal } from "./MetadataSelectorModal";
import { CustomDatePicker } from "./CustomDatePicker";

interface Props {
    survey: Survey;
    setSurvey: (survey: Survey) => void;
    availableCategories: Category[];
    availableGeneres: Genere[];
}

export const SurveySidebar = ({ survey, setSurvey, availableCategories, availableGeneres }: Props) => {
    const [showCatModal, setShowCatModal] = useState(false);
    const [showGenModal, setShowGenModal] = useState(false);

    const toggleCategory = (cat: Category) => {
        const current = survey.categoryList || [];
        const exists = current.find((c) => c.id === cat.id);
        const newList = exists ? current.filter((c) => c.id !== cat.id) : [...current, cat];
        setSurvey({ ...survey, categoryList: newList });
    };

    const toggleGenere = (gen: Genere) => {
        const current = survey.genereList || [];
        const exists = current.find((g) => g.id === gen.id);
        const newList = exists ? current.filter((g) => g.id !== gen.id) : [...current, gen];
        setSurvey({ ...survey, genereList: newList });
    };

    return (
        <ScrollView style={sidebarStyles.container}>
            <Text style={sidebarStyles.sectionTitle}>CONFIGURACIÓN</Text>

            {/* ALCANCE */}
            <View style={sidebarStyles.box}>
                <Text style={sidebarStyles.label}>Usuarios Objetivo</Text>
                <TextInput
                    style={sidebarStyles.input}
                    keyboardType="numeric"
                    placeholder="Ej: 100"
                    placeholderTextColor="#444"
                    value={survey.numUsers ? survey.numUsers.toString() : ""}
                    onChangeText={(val) => setSurvey({ ...survey, numUsers: parseInt(val) || 0 })}
                />
            </View>

            {/* BOTONES DE MODAL */}
            <Text style={sidebarStyles.label}>Metadatos de Steam</Text>
            
            <TouchableOpacity style={sidebarStyles.selectorBtn} onPress={() => setShowCatModal(true)}>
                <Text style={sidebarStyles.selectorBtnText}>
                    Categorías ({survey.categoryList?.length || 0})
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[sidebarStyles.selectorBtn, { marginTop: 10 }]} onPress={() => setShowGenModal(true)}>
                <Text style={sidebarStyles.selectorBtnText}>
                    Géneros ({survey.genereList?.length || 0})
                </Text>
            </TouchableOpacity>

           {/* --- COMPONENTES DE FECHA NUEVOS --- */}
            <View style={{ marginTop: 20 }}>
                <CustomDatePicker 
                    label="Fecha de Lanzamiento"
                    value={survey.launchDate}
                    onChange={(date) => setSurvey({ ...survey, launchDate: date })}
                />

                <CustomDatePicker 
                    label="Fecha de Cierre"
                    value={survey.closeDate}
                    onChange={(date) => setSurvey({ ...survey, closeDate: date })}
                />
            </View>

            {/* MODALES REUTILIZANDO EL COMPONENTE */}
            <MetadataSelectorModal
                visible={showCatModal}
                title="Categorías de Juego"
                items={availableCategories}
                selectedItems={survey.categoryList || []}
                onToggle={toggleCategory}
                onClose={() => setShowCatModal(false)}
            />

            <MetadataSelectorModal
                visible={showGenModal}
                title="Géneros Target"
                items={availableGeneres}
                selectedItems={survey.genereList || []}
                onToggle={toggleGenere}
                onClose={() => setShowGenModal(false)}
            />

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const sidebarStyles = StyleSheet.create({
    container: { padding: 15, backgroundColor: "#121212", borderRadius: 12, height: "100%" },
    sectionTitle: { color: colors.primary, fontWeight: "bold", fontSize: 12, marginBottom: 20, letterSpacing: 1 },
    box: { marginBottom: 20 },
    label: { color: "#888", fontSize: 11, fontWeight: "bold", marginBottom: 8, textTransform: "uppercase" },
    input: { backgroundColor: "#1a1a1a", color: "#fff", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#333" },
    inputFecha: { backgroundColor: "#000", color: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#333" },
    selectorBtn: {
        backgroundColor: "#222",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: "center"
    },
    selectorBtnText: { color: colors.primary, fontWeight: "bold", fontSize: 13 }
});