import React from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLayout } from '../utils/useLayout';
import styles from '../screens/stylesGlobal'; 

export const ResponsiveLayout = ({ children }: { children: React.ReactNode }) => {
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
                    <View style={[styles.caja, isDesktopView && styles.cajaDesktop]}>
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};