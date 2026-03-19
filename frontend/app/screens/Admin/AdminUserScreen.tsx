import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from './styles';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';
import strings from "../../../assets/supportFiles/strings.json";

export default function AdminUserScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);
    
    {/*Funciones para extraer los datos de la bd*/}
    

    return (

        <View style={[globalStyles.padre, globalStyles.tamanoCajaPadre, globalStyles.borde]}>
            {/* 1. HEADER / BOTÓN MENU */}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical]}>
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 20 }}>
                    <Text style={{ color: 'white' }}>{strings.menu}</Text>
                </TouchableOpacity>
            </View>

            {/*Creación del Crud de usuarios en nuestra app*/}
            <View style={[globalStyles.cajaMenu, globalStyles.alineadoPersonalVertical, globalStyles.borde2, {height: '100%'}]}>

            </View>

            {/* 3. MENU AL FINAL (FUERA DE TODO) */}
            <MenuPrincipal 
                visible={menuVisible} 
                onClose={() => setMenuVisible(false)} 
            />
        </View>

    );
}
