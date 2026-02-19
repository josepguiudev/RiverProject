import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    padre: {
        backgroundColor: '#000000', // Puedes usar nombres, HEX (#ff0000) o RGB
    },
    cajaMenu: {
        width: '100%',
        height: '5%'
    },
    tamanoCajaPadre:{
        width: '100%',
        height: '100%',
    },
    alineadoPersonal:{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center', // Verticalmente
        justifyContent: "center",
    },
    alineadoPersonalVertical:{
        display: 'flex',
        flexDirection: 'row', // Asegura el eje horizontal
        alignItems: 'center', // Centra verticalmente
        justifyContent: 'flex-start', // Alinea al inicio (izquierda) horizontalmente
    },
    borde:{
        borderWidth: 1,         // El "1px"
        borderColor: 'red',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
});