import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Platform } from "react-native";
import TypeWriter from "react-native-typewriter";
import globalStyles from "@/assets/globalStyles/globalStyles";
import strings from "@/assets/supportFiles/strings.json";
import styles from "./styles";
import ListaEncuestas from '@/app/components/Cards/ListEncuestas';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';

export default function HomeScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.alineadoPersonal}>
                    <View style={styles.contendorLogoTitulos}>
                        <View style={styles.contenedorWritter}>
                            <TypeWriter typing={1} style={globalStyles.subtituloWritter}>
                                Bienvenido a River Project
                            </TypeWriter>
                        </View>
                    </View>

                    <View style={styles.caja}>
                        <ListaEncuestas />
                    </View>
                </View>
            </ScrollView>

            {/* BOTÓN MENU ESTANDARIZADO */}
            <View style={{ 
                position: 'absolute',
                top: Platform.OS === 'ios' ? 50 : 20,
                left: 20,
                zIndex: 10,
            }}>
                <TouchableOpacity 
                    onPress={() => setMenuVisible(true)} 
                    style={{ 
                        padding: 10, 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)'
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{strings.menu || "MENÚ"}</Text>
                </TouchableOpacity>
            </View>

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}
