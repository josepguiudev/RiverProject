import { StyleSheet, Platform } from 'react-native';

export const colors = {
    background: '#000000',
    cardBg: '#161616',
    inputBg: '#1A1A1A',
    primary: '#5b55c0',
    secondary: '#3b82f6',
    textMain: '#FFFFFF',
    textSecondary: '#888888',
    border: '#333333',
};

export default StyleSheet.create({
    alineadoPersonal: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 40, // Evita que se pegue arriba/abajo en web
        ...Platform.select({
            web: { minHeight: '100vh' as any },
            default: { minHeight: '100%' as any }
        })
    },
    caja: {
        backgroundColor: colors.cardBg,
        borderRadius: 24,
        padding: 25,
        width: '90%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cajaDesktop: {
        width: '100%',
        maxWidth: 950, 
        padding: 40,
        ...Platform.select({
            web: { boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }
        })
    },
    contendorLogoTitulos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 30,
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 15,
    },
    tituloHero: {
        fontSize: 48,
        fontWeight: '900',
        color: colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    tituloHeroDesktop: {
        fontSize: 80,
    },
    destaqueAzul: {
        color: colors.secondary,
    },
    mainText: {
        color: colors.textMain,
        fontSize: 28,
        fontWeight: 'bold',
    },
    selectorContainer: {
        flexDirection: 'row',
        backgroundColor: colors.inputBg,
        borderRadius: 30,
        padding: 4,
        marginBottom: 30,
        width: '100%',
        maxWidth: 500, // No queremos el selector gigante en PC
    },
    selectorBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 25,
    },
    selectorBtnActive: {
        backgroundColor: colors.primary,
    },
    selectorText: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    selectorTextActive: {
        color: colors.textMain,
    },
    formGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    formStack: {
        width: '100%',
    },
    column: {
        width: '48%',
    },
    blueText: {
        color: colors.secondary,
        fontWeight: 'bold',
    },
    texto: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    contenedorWritter: {
        justifyContent: 'center',
    }
});