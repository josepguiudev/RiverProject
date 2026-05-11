import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import TypeWriter from "react-native-typewriter";
import globalStyles from "@/assets/globalStyles/globalStyles";
import styles from "./styles";
import ListaEncuestas from '@/app/components/Cards/ListEncuestas';
import MenuPrincipal from '@/app/components/Menu/CustomMenu';

export default function HomeScreen({ navigation }: any) {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#0e0d0df1' }}>
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

            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
            >
                <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>

            <MenuPrincipal visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}
