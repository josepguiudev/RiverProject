import { StyleSheet, Platform } from 'react-native';

export const colors = {
    background: '#0e0d0df1',      // Tu negro principal
    cardBg: '#263238',            // El color de tus tarjetas de Auth
    primary: '#5b55c0',           // Azul Aceternity
    secondary: '#3b82f6',         // Azul Eléctrico
    accent: '#64B5F6',            // Azul Claro Auth
    cta: '#8BC34A',               // Verde Lima botones
    textMain: '#F0F2F5',          // Blanco/Gris claro
    white: '#ffffff',
};

export const inputStyles = {
    inputStandard: {
        backgroundColor: '#1A1A1A',
        color: '#FFF',
        fontSize: 16,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
    }
}

export default StyleSheet.create({
    // --- LAYOUT Y CONTENEDORES ---
    alineadoPersonal: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        ...Platform.select({
            web: { minHeight: '100vh' as any },
            default: { minHeight: '100%' as any }
        })
    },
    caja: {
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 20,
        width: '85%',
        alignItems: 'center',
        justifyContent: "center",
    },
    cajaDesktop: {
        width: '40%',
        maxWidth: 500,
        padding: 40,
    },
    maxWidth: { width: '100%' },
    maxHeigth: { height: '100%' },
    noJustify: { justifyContent: 'flex-start' },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    margen1: { marginTop: 5 },
    margen2: { marginTop: 20 },

    // --- CABECERA Y LOGO ---
    contendorLogoTitulos: {
        flexDirection: 'row',
        height: 120,
        padding: 10,
    },
    containerFoto: {
        width: 80,
        height: '100%',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    // --- TEXTOS HERO Y TYPEWRITER ---
    tituloHero: {
        fontSize: 60,
        fontWeight: '900',
        color: colors.primary,
        textAlign: 'center',
        letterSpacing: -1,
        lineHeight: 48,
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowRadius: 10,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    tituloHeroDesktop: {
        fontSize: 100,
        lineHeight: 80,
    },
    destaqueAzul: {
        color: colors.secondary,
        textShadowColor: 'rgba(59, 130, 246, 0.5)',
        textShadowRadius: 15,
    },
    mainText: {
        color: colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    mainTextDesktop: {
        fontSize: 48,
    },
    blueText: {
        color: colors.primary,
    },
    textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenedorWritter: {
        alignItems: 'center',
        padding: 20,
    },
    texto: {
        marginTop: 5,
        color: 'white',
    },

    // --- CURSOR ANIMADO ---
    cursor: {
        width: 4,
        height: 36,
        backgroundColor: colors.primary,
        marginLeft: 5,
    },
    cursorDesktop: {
        height: 52,
    },

    // --- BOTONES Y FORMULARIOS ---
    btnPrimary: {
        backgroundColor: colors.cta,
        width: '90%',
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#1D2735',
        fontSize: 16,
        fontWeight: '800',
    },
    btnSecondary: {
        width: '90%',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.textMain,
    },

    // --- ENCUESTAS (SURVEY LIST) ---
    cajaEncuestas: {
        width: '100%',
        backgroundColor: '#1a1a1a', // Un gris casi negro para resaltar sobre el fondo
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(91, 85, 192, 0.3)', // Borde sutil azul Aceternity
        padding: 15,
    },
    tittleTextSurvey: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    tittleTextSurveyDesktop: {
        fontSize: 18,
    },

    // --- BORDES DE DEPURACIÓN (Debug) ---
    borde: { borderWidth: 1, borderColor: 'red' },
    borde2: { borderWidth: 1, borderColor: 'green' },
    borde3: { borderWidth: 1, borderColor: 'orange' },
});