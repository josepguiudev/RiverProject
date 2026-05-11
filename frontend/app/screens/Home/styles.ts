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
    alineadoPersonal: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    contendorLogoTitulos: {
        alignItems: 'center',
        marginBottom: 30,
    },
    contenedorWritter: {
        height: 40,
        justifyContent: 'center',
    },
    caja: {
        backgroundColor: '#161616',
        borderRadius: 10,
        padding: 20,
        minHeight: 300,
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: '#5b55c0',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 30,
    }
});