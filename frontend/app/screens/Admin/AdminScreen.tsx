import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from "react-native";

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';

import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";

import CustomInputCard from '@/app/components/CustomInputCard/CustomInputCard';

export default function AdminScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    
    return (
        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.borde, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.alineadoPersonal]}>
                <View style={[styles.cajaPrincipal, globalStyles.borde, globalStyles.filas]}>
                    <View style={[globalStyles.borde2, styles.contenedorFila, globalStyles.alineadoPersonalHorizontal]}>
                        <CustomInputCard title='Extraer Users' value={1}/>
                        <CustomInputCard title='Extraer Juegos Bibliotecas' value={3}/>
                        <CustomInputCard title='Extraer Juegos' value={2}/>
                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2]}>
                        
                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2]}>

                    </View>
                    <View style={[globalStyles.borde2, styles.contenedorFila2]}>

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