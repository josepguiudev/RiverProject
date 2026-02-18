import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
   overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0, // Asegura que llegue hasta el final de la pantalla
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)', // Oscurece el fondo del home
        zIndex: 1000,
        flexDirection: 'row',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: '15%',
        height: '100%',
        backgroundColor: '#111', // Un gris muy oscuro casi negro (opaco)
        padding: 20,
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#f1c40f', // Opcional: línea amarilla como tus bordes
    },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed' },
    linea: { height: 1, backgroundColor: '#333', marginVertical: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed' },
    item: { color: 'white', fontSize: 12, marginBottom: 20 }
});