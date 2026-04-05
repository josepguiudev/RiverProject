import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Survey {
    id_survey?: number;
    name?: string;
    creationDate?: string;
    // remunerated?: boolean;  // TODO: añadir cuando el backend lo soporte
}

interface Props {
    surveys: Survey[];
    loading: boolean;
    isMobile: boolean;
}

function formatDate(dateString?: string): string {
    if (!dateString) return 'Fecha desconocida';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
    });
}

export default function SurveysGrid({ surveys, loading, isMobile }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Encuestas Realizadas</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#5b55c0" />
            ) : surveys.length === 0 ? (
                <Text style={styles.emptyText}>
                    No has realizado ninguna encuesta todavía.
                </Text>
            ) : (
                <>
                    <View style={[
                        styles.grid,
                        isMobile ? styles.gridMobile : styles.gridDesktop
                    ]}>
                        {surveys.map((survey, index) => (
                            <View
                                key={survey.id_survey || index}
                                style={[
                                    styles.card,
                                    isMobile ? styles.cardMobile : styles.cardDesktop
                                ]}
                            >
                                <Text style={styles.surveyNumber}>
                                    #{survey.id_survey || index + 1}
                                </Text>

                                <Text style={styles.surveyName} numberOfLines={2}>
                                    {survey.name || 'Encuesta sin título'}
                                </Text>

                                <View style={styles.dateRow}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={12}
                                        color="#a2a8d3"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={styles.surveyDate}>
                                        {formatDate(survey.creationDate)}
                                    </Text>
                                </View>

                                {/* TODO: badge de remunerado cuando el backend lo soporte
                                <View style={styles.remuneratedBadge}>
                                    <Text style={styles.remuneratedText}>
                                        {survey.remunerated ? 'REM' : 'NO'}
                                    </Text>
                                </View>
                                */}
                            </View>
                        ))}
                    </View>

                    {/* TODO: sección € obtenido cuando el backend lo soporte
                    <View style={styles.earningsContainer}>
                        <Text style={styles.earningsTitle}>€ Obtenido</Text>
                        <Text style={styles.earningsAmount}>0.00 €</Text>
                    </View>
                    */}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridMobile: {
        gap: 12,
    },
    gridDesktop: {
        gap: 16,
    },
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#263238',
        padding: 16,
        shadowColor: '#5b55c0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    cardMobile: {
        width: '48%',
    },
    cardDesktop: {
        width: '31%',
    },
    surveyNumber: {
        color: '#5b55c0',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
    },
    surveyName: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
        lineHeight: 20,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    surveyDate: {
        color: '#a2a8d3',
        fontSize: 12,
    },
    emptyText: {
        color: '#a2a8d3',
        fontStyle: 'italic',
    },
});
