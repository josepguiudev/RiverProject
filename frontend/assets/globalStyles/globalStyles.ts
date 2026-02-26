import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    padre: {
        backgroundColor: '#000000',
    },
    cajaMenu: {
        width: '100%',
        height: 60, // Altura estándar para menús/headers
    },
    tamanoCajaPadre: {
        width: '100%',
        height: '100%',
    },
    alineadoPersonal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    alineadoPersonalVertical: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    alineadoPersonalHorizontal: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    borde: {
        borderWidth: 1,
        borderColor: 'red',
        borderStyle: 'solid',
    },
    borde2: {
        borderWidth: 1,
        borderColor: 'blue',
        borderStyle: 'solid',
    },
    borde3: {
        borderWidth: 1,
        borderColor: 'orange',
        borderStyle: 'solid',
    },
    filas: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});