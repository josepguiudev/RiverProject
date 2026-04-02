import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLayout } from '../utils/useLayout';
import styles from '../screens/stylesGlobal'; 

// Añadimos la prop 'fullWidth'
interface Props {
    children: React.ReactNode;
    fullWidth?: boolean; 
}

export const ResponsiveLayout = ({ children, fullWidth = false }: Props) => {
    const { isDesktopView } = useLayout();

    return (
        <View style={styles.alineadoPersonal}> 
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ width: '100%', flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={[
                        styles.alineadoPersonal,
                        isDesktopView && { paddingVertical: 40 } 
                    ]}
                >
                    {/* Si fullWidth es true, usamos un estilo ancho. Si no, el de siempre */}
                    <View style={[
                        styles.caja, 
                        isDesktopView && (fullWidth ? { width: '90%', maxWidth: 1000 } : styles.cajaDesktop)
                    ]}>
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};