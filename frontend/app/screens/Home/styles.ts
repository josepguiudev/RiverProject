import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    borde:{
        borderWidth: 1,         // El "1px"
        borderColor: 'red',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
    borde2:{
        borderWidth: 1,         // El "1px"
        borderColor: 'green',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
    borde3:{
        borderWidth: 1,         // El "1px"
        borderColor: 'orange',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
    cajaHome: {
        width: '90%',
        height: '95%'
    },
    cajaEncuestas:{
        width: '90%',
        height: '23%',
        backgroundColor: '#0e0d0df1', 
        borderRadius: 20, // Esquinas redondeadas
    },
    cajaTextoEncuestas:{
        width: '100%',
        height: '15%',
        paddingLeft: '2%', 
        display: 'flex',
        flexDirection: 'row',
    },
    cajaComponentesEncuestas:{
        width: '100%',
        height: '85%'
    },
    width98:{
        width: '98%',
    },
    width2:{
        width: '2%',
    },
    margin1:{
        margin: '1%'
    },
    justify1:{
        justifyContent: 'space-between'
    },
    tittleTextSurvey: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
        // En Android la fuente bold a veces necesita esto para verse muy gruesa
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
});