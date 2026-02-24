import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    back:{
        backgroundColor: '#a7a7a7',
    },
    cardSize: {
        width: '90%',
        height: '30%',
        borderRadius: 20,
        margin: '5%'
    },
    contenedorWritter: {
        alignItems: 'flex-start',
        padding: 5,
    },
    contenedorSecundario: {
        width: '100%',
        height: '70%',
        padding: 5,
    },
    contenedorTerciario: {
        width: '100%',
        height: '15%',
    },
    contenedorInterno: {
        width: '100%',
        height: '70%'
    },
    contenedorInterno2: {
        width: '100%',
        height: '30%'
    },
    textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        color: '#3f3e3e',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
});