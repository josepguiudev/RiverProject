import { StyleSheet, Platform } from 'react-native';
import { colors } from './stylesGlobal';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Platform.OS === 'web' ? 40 : 20,
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center', // Centra el bloque en la pantalla
        alignItems: 'center', // Centra el contenido interno
    },
    headerSection: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        gap: 20,
    },
    headerTextContainer: {
        flex: 1,
        width: '100%',
    },
    surveyCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        width: '100%',
        // Cambiamos a column por defecto para evitar el solapamiento de la foto
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', // Esto hace que si no caben, el botón baje solo
        gap: 15,
    },
    cardInfo: {
        flex: 1,
        minWidth: 200, // Evita que el texto se comprima demasiado
    },
    cardActions: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // Si es móvil o web estrecha, esto permite que los botones respiren
        flexWrap: 'nowrap', 
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        justifyContent: 'flex-start',
    },
    buttonContainer: {
        minWidth: 200,
        alignItems: Platform.OS === 'web' ? 'flex-end' : 'center',
    },

});