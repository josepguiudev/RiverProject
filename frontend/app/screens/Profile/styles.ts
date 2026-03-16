import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    // Estilos de la cabecera (Sección 1 - Para que el usuario lo haga)
    headerSection: {
        marginBottom: 20,
        height: 100,
        backgroundColor: '#1a1a2e',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Estilos de Gráfica y Juegos (Sección 2 - Para que el usuario lo haga)
    middleSection: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
        height: 200,
    },
    chartPlaceholder: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        marginRight: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gamesPlaceholder: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        marginLeft: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Estilos de las Encuestas (Sección 3 - Implementada)
    surveysTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    surveysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Esto es lo que hace que sea un "Grid": Si no caben, bajan de linea
        justifyContent: 'space-between',
    },
    surveyCard: {
        width: Platform.OS === 'web' ? '31%' : '48%', // En web caben 3 por fila, en movil 2
        backgroundColor: '#162447',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#1f4068',
        elevation: 3, // sombra en android
        shadowColor: '#000', // sombra en ios/web
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    surveyCount: {
        color: '#e43f5a',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    surveyName: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    surveyDate: {
        color: '#a2a8d3',
        fontSize: 12,
    },
    emptyText: {
        color: '#a2a8d3',
        fontStyle: 'italic',
    }
});
