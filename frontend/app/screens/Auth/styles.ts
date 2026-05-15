import { StyleSheet, Platform } from 'react-native';

export const colors = {
    background: '#000000', // CORREGIDO: Negro absoluto (antes #0e0d0df1)
    cardBg: '#161616',
    inputBg: '#1A1A1A',
    primary: '#5b55c0',
    secondary: '#3b82f6',
    textMain: '#FFFFFF',
    white: '#ffffff',
    textSecondary: '#888888',
    border: '#333333',
    dashboardBtn: '#3b82f6' // Color para el nuevo botón
};

export default StyleSheet.create({
    alineadoPersonal: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 40,
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
        width: '70%',
        maxWidth: 950, 
        padding: 40,
        ...Platform.select({
            web: { boxShadow: '0 20px 40px rgba(0,0,0,0.4)' as any }
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
        maxWidth: 500, 
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
    },
    textoChico: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
    row: { 
        flexDirection: 'row',
        alignItems: 'center' 
    },
    margen2: { 
        marginTop: 20 
    },

    // AGREGADO: Estilo para el botón Dashboard que faltaba
    btnDashboard: {
        backgroundColor: colors.dashboardBtn,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        ...Platform.select({
            web: { cursor: 'pointer' as any }
        })
    },
    btnDashboardText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '800',
    },
    
    // AGREGADO: Estilo 'botonGrande' para evitar errores de TypeScript en otras pantallas
    botonGrande: {
        backgroundColor: colors.primary,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    textoBotonGrande: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});