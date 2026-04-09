import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import TypeWriter from "react-native-typewriter";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from "./styles";
import ListaEncuestas from '@/app/components/Cards/ListEncuestas';
import MenuPrincipal from "@/app/components/Menu/CustomMenu";
import { useLayout } from '@/app/utils/useLayout';
import strings from "../../../assets/supportFiles/strings.json";

export default function HomeScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    const { isDesktopView, isTabletView } = useLayout();

    const renderSurveySection = (type: string) => (
        <View style={[
            styles.borde2,
            styles.cajaEncuestas,
            isTabletView && styles.cajaEncuestasTablet
        ]}>
            <View style={[styles.borde3, styles.cajaTextoEncuestas]}>
                <TypeWriter typing={1} maxDelay={50} style={[
                    styles.tittleTextSurvey,
                    isDesktopView && styles.tittleTextSurveyDesktop
                ]}>
                    {strings.survey} {type}
                </TypeWriter>
            </View>
            <View style={[styles.borde3, styles.cajaComponentesEncuestas]}>
                {type === strings.type1 && <ListaEncuestas />}
            </View>
        </View>
    );

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, styles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={[
                    styles.container,
                    isDesktopView && styles.containerDesktop,
                    globalStyles.alineadoPersonal
                ]}
            >
                <View style={[
                    styles.borde,
                    styles.cajaHome,
                    isDesktopView && styles.cajaHomeDesktop,
                    globalStyles.alineadoPersonal
                ]}>
                    {renderSurveySection(strings.type1)}
                    {renderSurveySection(strings.type2)}
                    {renderSurveySection(strings.type3)}
                    {renderSurveySection(strings.type4)}
                </View>
            </ScrollView>

            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
            />
        </View>
    );
}
