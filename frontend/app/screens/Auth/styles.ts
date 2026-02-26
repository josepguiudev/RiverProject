import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    caja: {
        // '000000' es negro, 'B3' es ~70% de opacidad en Hexadecimal
        // También puedes usar 'rgba(0, 0, 0, 0.7)'
        backgroundColor: '#0e0d0df1',
        borderRadius: 20,
        padding: 20,
        width: '85%',
        alignItems: 'center',
        alignContent: 'center', // Verticalmente
        justifyContent: "center",
    },
    cajaDesktop: {
        width: '40%',
        maxWidth: 500,
        padding: 40,
    },
    texto: {
        marginTop: 5,
        color: 'white',
    },
    maxWidth: {
        width: '100%',
    },
    maxHeigth: {
        height: '100%',
    },
    contendorLogoTitulos: {
        flexDirection: 'row',
        height: 120,
        padding: 10,
    },
    borde: {
        borderWidth: 1,         // El "1px"
        borderColor: 'red',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
    borde2: {
        borderWidth: 1,         // El "1px"
        borderColor: 'green',     // El "red"
        borderStyle: 'solid',   // Opcional (es el valor por defecto)
    },
    margen1: {
        marginTop: 5,
    },
    margen2: {
        marginTop: 20,
    },
    noJustify: {
        justifyContent: 'flex-start'
    },
    alineadoPersonal: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center', // Verticalmente
        justifyContent: "center",
    },
    containerFoto: {
        width: 80,
        height: '100%',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // Ajusta la imagen sin deformarla
    },
    contenedorWritter: {
        alignItems: 'center',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        // En Android la fuente bold a veces necesita esto para verse muy gruesa
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    mainTextDesktop: {
        fontSize: 48,
    },
    blueText: {
        color: '#5b55c0', // El azul característico de Aceternity
    },
    cursor: {
        width: 4,
        height: 36,
        backgroundColor: '#5b55c0',
        marginLeft: 5,
        // Puedes añadir una animación simple de opacidad para el parpadeo
    },
    cursorDesktop: {
        height: 52,
    },
    textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloHero: {
        fontSize: 60,
        fontWeight: '900', // Grosor máximo
        color: '#5b55c0',
        textAlign: 'center',
        letterSpacing: -1, // Letras más juntas para estilo moderno
        lineHeight: 48, // Efecto de brillo sutil (Glow)
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10, // Ajuste de fuente según sistema
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    tituloHeroDesktop: {
        fontSize: 100,
        lineHeight: 80,
    },
    destaqueAzul: {
        color: '#3b82f6',
        // Un azul eléctrico tipo Aceternity
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowRadius: 15,
    }
});