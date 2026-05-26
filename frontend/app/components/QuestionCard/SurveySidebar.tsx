import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Category, Genere, Survey } from "../../types/formsSurvey.types";
import { colors } from "../../screens/stylesGlobal";
import { MetadataSelectorModal } from "./MetadataSelectorModal";
import { CustomDatePicker } from "./CustomDatePicker";
import { Ionicons } from "@expo/vector-icons";

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
        <ScrollView style={sidebarStyles.container} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Ionicons name="settings-outline" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={sidebarStyles.sectionTitle}>CONFIGURACIÓN DEL TARGET</Text>
            </View>

            {/* ALCANCE DE USUARIOS */}
            <View style={sidebarStyles.box}>
                <Text style={sidebarStyles.label}>Usuarios Objetivo</Text>
                <View style={sidebarStyles.inputWrapper}>
                    <Ionicons name="people-outline" size={18} color="#666" style={{ marginLeft: 10 }} />
                    <TextInput
                        style={sidebarStyles.input}
                        keyboardType="numeric"
                        placeholder="Ej: 100"
                        placeholderTextColor="#444"
                        value={survey.numUsers ? survey.numUsers.toString() : ""}
                        onChangeText={(val) => setSurvey({ ...survey, numUsers: parseInt(val) || 0 })}
                    />
                </View>
            </View>

            {/* METADATOS STEAM */}
            <Text style={sidebarStyles.label}>Filtros de Steam</Text>
            
            <TouchableOpacity style={sidebarStyles.selectorBtn} onPress={() => setShowCatModal(true)}>
                <View style={sidebarStyles.btnContent}>
                    <Text style={sidebarStyles.selectorBtnText}>
                        Categorías ({survey.categoryList?.length || 0})
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[sidebarStyles.selectorBtn, { marginTop: 12 }]} onPress={() => setShowGenModal(true)}>
                <View style={sidebarStyles.btnContent}>
                    <Text style={sidebarStyles.selectorBtnText}>
                        Géneros ({survey.genereList?.length || 0})
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </View>
            </TouchableOpacity>

            {/* FECHAS */}
            <View style={{ marginTop: 25, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 20 }}>
                <CustomDatePicker 
                    label="Fecha de Lanzamiento"
                    value={survey.launchDate}
                    onChange={(date) => setSurvey({ ...survey, launchDate: date })}
                />

                <View style={{ height: 10 }} />

                <CustomDatePicker 
                    label="Fecha de Cierre"
                    value={survey.closeDate}
                    onChange={(date) => setSurvey({ ...survey, closeDate: date })}
                />
            </View>

            {/* MODALES */}
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

            <View style={{ height: 60 }} />
        </ScrollView>
    );
};

const sidebarStyles = StyleSheet.create({
    container: { 
        padding: 20, 
        backgroundColor: "#161616", // Acorde a tu cardBg
        borderRadius: 20, 
        height: "100%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)"
    },
    sectionTitle: { 
        color: colors.primary, 
        fontWeight: "900", 
        fontSize: 13, 
        letterSpacing: 1.5 
    },
    box: { marginBottom: 25 },
    label: { 
        color: colors.textSecondary, 
        fontSize: 11, 
        fontWeight: "800", 
        marginBottom: 10, 
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#000",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    input: { 
        flex: 1,
        color: "#fff", 
        padding: 12, 
        fontSize: 15,
        fontWeight: '600'
    },
    selectorBtn: {
        backgroundColor: "rgba(91, 85, 192, 0.05)", // Un toque de tu color primary
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    btnContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectorBtnText: { 
        color: colors.primary, 
        fontWeight: "bold", 
        fontSize: 14 
    }
});