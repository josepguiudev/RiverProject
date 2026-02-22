import React, { useState } from 'react';

import { View, TouchableOpacity, Text } from "react-native";
import TypeWriter from "react-native-typewriter";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from "./styles";
import ListaEncuestas from '@/app/components/Cards/ListEncuestas';

import MenuPrincipal from "@/app/components/Menu/CustomMenu";

import strings from "../../../assets/supportFiles/strings.json";

export default function HomeScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, styles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>



            <View style={[styles.borde, styles.cajaHome, globalStyles.alineadoPersonal, styles.justify1]}>
                <View style={[styles.borde2, styles.cajaEncuestas]}>
                    <View style={[styles.borde3, styles.cajaTextoEncuestas, globalStyles.alineadoPersonalVertical]}>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width98]}>
                            {strings.survey} {strings.type1}
                        </TypeWriter>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width2]}>
                            {strings.type0}
                        </TypeWriter>
                    </View>
                    <View style={[styles.borde3, styles.cajaComponentesEncuestas]}>
                        <ListaEncuestas/>
                    </View>
                </View>
                <View style={[styles.borde2, styles.cajaEncuestas]}>
                    <View style={[styles.borde3, styles.cajaTextoEncuestas, globalStyles.alineadoPersonalVertical]}>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width98]}>
                            {strings.survey} {strings.type2}
                        </TypeWriter>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width2]}>
                            {strings.type0}
                        </TypeWriter>
                    </View>
                    <View style={[styles.borde3, styles.cajaComponentesEncuestas]}>
                    </View>
                </View>
                <View style={[styles.borde2, styles.cajaEncuestas]}>
                    <View style={[styles.borde3, styles.cajaTextoEncuestas, globalStyles.alineadoPersonalVertical]}>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width98]}>
                            {strings.survey} {strings.type3}
                        </TypeWriter>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width2]}>
                            {strings.type0}
                        </TypeWriter>
                    </View>
                    <View style={[styles.borde3, styles.cajaComponentesEncuestas]}>
                    </View>
                </View>
                <View style={[styles.borde2, styles.cajaEncuestas]}>
                    <View style={[styles.borde3, styles.cajaTextoEncuestas, globalStyles.alineadoPersonalVertical]}>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width98]}>
                            {strings.survey} {strings.type4}
                        </TypeWriter>
                        <TypeWriter typing={1} maxDelay={50} style={[styles.tittleTextSurvey, styles.width2]}>
                            {strings.type0}
                        </TypeWriter>
                    </View>
                    <View style={[styles.borde3, styles.cajaComponentesEncuestas]}>
                    </View>
                </View>
            </View>


            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>
    );
}
