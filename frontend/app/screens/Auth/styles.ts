import { StyleSheet, Platform } from 'react-native';
import { wp, hp, fontScale } from '@/app/utils/device';

export default StyleSheet.create({
    caja: {
        // '000000' es negro, 'B3' es ~70% de opacidad en Hexadecimal
        // También puedes usar 'rgba(0, 0, 0, 0.7)'
        backgroundColor: '#0e0d0df1',
        borderRadius: wp(5),
        padding: wp(5),
        width: wp(70),
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center', // Verticalmente
        justifyContent: "center",
        height: 'auto'
    },
    texto: {
        marginTop: hp(0.5),
        color: 'white',
    },
    maxWidth: {
        width: wp(100),
    },
    maxHeigth: {
        height: hp(100),
    },
    contendorLogoTitulos: {
        flexDirection: 'row',
        height: hp(15),
        padding: wp(2.5),
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
        marginTop: hp(0.5),
    },
    margen2: {
        marginTop: hp(3),
    },
    noJustify: {
        justifyContent: 'flex-start'
    },
    alineadoPersonal: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center', // Verticalmente
        justifyContent: "center",
    },
    containerFoto: {
        width: wp(20),
        height: hp(100),
    },
    logo: {
        width: wp(100),
        height: hp(100),
        resizeMode: 'contain', // Ajusta la imagen sin deformarla
    },
    contenedorWritter: {
        alignItems: 'center',
        padding: wp(5),
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        color: '#fff',
        fontSize: fontScale(32),
        fontWeight: 'bold',
        textAlign: 'center',
        // En Android la fuente bold a veces necesita esto para verse muy gruesa
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    blueText: {
        color: '#5b55c0', // El azul característico de Aceternity
    },
    cursor: {
        width: wp(1),
        height: hp(4.5),
        backgroundColor: '#5b55c0',
        marginLeft: wp(1.3),
        // Puedes añadir una animación simple de opacidad para el parpadeo
    },
    textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tituloHero: {
        fontSize: fontScale(70),
        fontWeight: '900', // Grosor máximo
        color: '#5b55c0',
        textAlign: 'center',
        letterSpacing: wp(-0.4), // Letras más juntas para estilo moderno
        lineHeight: fontScale(48), // Efecto de brillo sutil (Glow)
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: wp(4), // Ajuste de fuente según sistema
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    destaqueAzul: {
        color: '#3b82f6',
        // Un azul eléctrico tipo Aceternity
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowRadius: wp(5),
    }
});