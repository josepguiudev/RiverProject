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
    // Estilos de Gráfica y Juegos (Sección 2)
    middleSection: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
        height: 250,
    },
    chartPlaceholder: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        marginRight: 10,
        borderRadius: 10,
        padding: 15,
    },
    gamesPlaceholder: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        marginLeft: 10,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    // Estilos de la escalera de juegos (Overlapping)
    staircaseContainer: {
        position: 'relative',
        width: 120, // Ajustar según necesidad
        height: 180,
    },
    gameImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#1a1a2e',
    },
    game1: {
        zIndex: 3,
        top: 0,
        left: 0,
    },
    game2: {
        zIndex: 2,
        top: 15,
        left: 20,
        opacity: 0.9,
    },
    game3: {
        zIndex: 1,
        top: 30,
        left: 40,
        opacity: 0.8,
    },
    // Estilos de géneros
    genreItem: {
        backgroundColor: '#162447',
        padding: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    genreText: {
        color: '#e43f5a',
        fontWeight: 'bold',
        textAlign: 'center'
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
