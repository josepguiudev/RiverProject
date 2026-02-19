import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
   overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0, // Asegura que llegue hasta el final de la pantalla
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)', // Oscurece el fondo del home
        zIndex: 1000,
        flexDirection: 'row',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    menuContainer: {
        width: '15%',
        height: '100%',
        backgroundColor: '#171a21', // Un gris muy oscuro casi negro (opaco)
        padding: 10,
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#1b2838', // Opcional: línea amarilla como tus bordes
    },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold', paddingLeft: 10, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed' },
    linea: { height: 1, backgroundColor: '#333', marginVertical: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed' },
    itemContenedor: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginVertical: 2,
    },
    itemHover: {
        backgroundColor: '#2a475e', // El azul cuando pasas el ratón en Steam
    },
    item: { color: 'white', fontSize: 12},
    itemTextHover: {
        color: '#66c0f4', // Azul brillante de Steam al hacer hover
    }, 
    maxHeight:{
        height: '100%',
    },
});