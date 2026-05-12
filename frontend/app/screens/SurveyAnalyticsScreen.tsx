import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import stylesGlobal, { colors } from './stylesGlobal';

export default function SurveyAnalyticsScreen() {
    const route = useRoute<any>();
    const { supersetID, title } = route.params;

    // URL de tu servidor Superset (ajusta a tu dominio)
    const SUPERSET_DOMAIN = "https://tu-instancia-superset.com";
    
    // Construcción de la URL para modo Embedded
    const embedUrl = `${SUPERSET_DOMAIN}/embedded/${supersetID}?standalone=true&show_filters=true`;

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header de la pantalla */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Análisis en Tiempo Real</Text>
                <Text style={styles.headerSubtitle}>{title}</Text>
            </View>

            {Platform.OS === 'web' ? (
                <View style={{ flex: 1 }}>
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        allowTransparency
                        allowFullScreen
                    />
                </View>
            ) : (
                <View style={styles.centered}>
                    <Text style={{ color: '#888' }}>
                        La visualización detallada está optimizada para la versión Web.
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    headerTitle: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
    }
});