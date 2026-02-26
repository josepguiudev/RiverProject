import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    borde: {
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'solid',
    },
    borde2: {
        borderWidth: 1,
        borderColor: 'green',
        borderStyle: 'solid',
    },
    borde3: {
        borderWidth: 1,
        borderColor: 'orange',
        borderStyle: 'solid',
    },
    container: {
        flex: 1,
    },
    containerDesktop: {
        padding: 40,
    },
    cajaHome: {
        width: '90%',
        height: '95%',
    },
    cajaHomeDesktop: {
        width: '70%',
        maxHeight: '90%',
    },
    cajaEncuestas: {
        width: '100%',
        height: 180,
        backgroundColor: '#0e0d0df1',
        borderRadius: 20,
        marginBottom: 15,
    },
    cajaEncuestasTablet: {
        width: '48%', // Dos columnas en tablet si se usara flex-wrap
    },
    cajaTextoEncuestas: {
        width: '100%',
        height: 40,
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cajaComponentesEncuestas: {
        width: '100%',
        height: 140,
    },
    tittleTextSurvey: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    tittleTextSurveyDesktop: {
        fontSize: 16,
    }
});