import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from "react-native";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";
import CustomInputCard from '@/app/components/CustomInputCard/CustomInputCard';
import { useLayout } from '@/app/utils/useLayout';

export default function AdminScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    const { isDesktopView } = useLayout();

    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: isDesktopView ? 30 : 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
                <View style={[
                    styles.cajaPrincipal,
                    isDesktopView && styles.cajaPrincipalDesktop,
                    globalStyles.borde
                ]}>
                    <View style={[
                        globalStyles.borde2,
                        styles.contenedorFila,
                        isDesktopView && styles.contenedorFilaDesktop,
                        globalStyles.alineadoPersonalHorizontal
                    ]}>
                        <CustomInputCard title='Extraer Users' value={1} />
                    </View>
                    <View style={[
                        globalStyles.borde2,
                        styles.contenedorFila,
                        isDesktopView && styles.contenedorFilaDesktop
                    ]}>
                    </View>
                    <View style={[
                        globalStyles.borde2,
                        styles.contenedorFila,
                        isDesktopView && styles.contenedorFilaDesktop
                    ]}>
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