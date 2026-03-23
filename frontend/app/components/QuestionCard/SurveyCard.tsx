import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Survey } from '../../types/formsSurvey.types';
import styles from '../../screens/stylesGlobal'; 
import { useLayout } from '@/app/utils/useLayout';

interface Props {
    survey: Survey;
    isCompleted: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>; // <--- Agregado para corregir error ts(2322)
}

export const SurveyCard = ({ survey, isCompleted, onPress, style }: Props) => {
    const { isDesktopView } = useLayout();

    return (
        <TouchableOpacity 
            style={[
                styles.cajaEncuestas, 
                { padding: 20, justifyContent: 'center' },
                style,
                isCompleted && { opacity: 0.6, borderColor: '#333', backgroundColor: '#121212' },
            ]} 
            onPress={onPress}
            disabled={isCompleted}
        >
            <View>
                <Text style={[
                    styles.tittleTextSurvey, 
                    isDesktopView && styles.tittleTextSurveyDesktop,
                    isCompleted && { color: '#757575' }
                ]}>
                    {survey.name || "Encuesta sin título"}
                </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Text style={[styles.texto, { fontSize: 14, color: '#aaa' }]}>
                        Preguntas: {survey.numQuestions || 0}
                    </Text>
                    {survey.idPagoPanelista && !isCompleted && (
                        <Text style={{ color: '#64B5F6', fontSize: 13, marginLeft: 15 }}>
                            • Recompensa disponible
                        </Text>
                    )}
                </View>

                {isCompleted && (
                    <View style={localStyles.badgeCompleted}>
                        <Text style={localStyles.badgeText}>✓ COMPLETADA</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    badgeCompleted: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#444'
    },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#888' }
});