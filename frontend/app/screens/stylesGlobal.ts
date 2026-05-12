import { isWeb } from './../utils/device';
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Colores unificados (combinación de todas tus definiciones)
export const colors = {
    // Paleta principal
    background: '#0e0d0df1',
    cardBg: '#263238',
    primary: '#5b55c0',
    secondary: '#3b82f6',
    accent: '#64B5F6',
    cta: '#8BC34A',
    textMain: '#F0F2F5',
    white: '#ffffff',
    darkCard: '#161616',
    borderDark: 'rgba(255, 255, 255, 0.1)',
    // Colores adicionales (para web, login, etc.)
    surface: '#161616',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#2a2a2a',
    blue: '#4a90e2',
    danger: '#ff4d4d'
};

export default StyleSheet.create({
    // ========== CONTENEDORES PRINCIPALES ==========
    alineadoPersonal: {
        flex: 1,
        backgroundColor: colors.background,
        width: '100%',
        minHeight: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    },
    fullWidthContainer: {
        width: '100%',
        flex: 1,
        alignSelf: 'stretch',
    },
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ========== CAJA PARA LOGIN / REGISTER ==========
    caja: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        width: '85%',
        maxWidth: 450,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
            android: { elevation: 4 }
        })
    },
    cajaDesktop: {
        width: '100%',
        maxWidth: 500,
        padding: 32,
        alignSelf: 'center',
    },

    // ========== CABECERA Y LOGO ==========
    contendorLogoTitulos: {
        alignItems: 'center',
        flexDirection: isWeb ? 'row' : 'column',
        justifyContent: 'center',
        height: isWeb ? 120 : 'auto',
        padding: 10,
        marginBottom: isWeb ? 0 : 20,
        width: '100%',
    },
    containerFoto: {
        width: 80,
        height: 80,
    },
    logo: {
        width: isWeb ? 100 : 120,
        height: isWeb ? '100%' : 120,
        resizeMode: 'contain',
        marginBottom: isWeb ? 0 : 10,
    },
    contenedorWritter: {
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },

    // ========== TEXTOS ==========
    tituloHero: {
        fontSize: isWeb ? 60 : 36,
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
    texto: {
        color: colors.white,
        fontSize: 14,
        marginTop: 5,
    },
    textoChico: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
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

    // ========== BOTONES ==========
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
        backgroundColor: 'transparent',
    },

    // ========== ENCUESTAS (compartido web/Android) ==========
    contenedorListado: {
        width: '100%',
        maxWidth: 1000,
        alignSelf: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    cajaEncuestas: {
        backgroundColor: '#161616',
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 85, 192, 0.2)',
        padding: 35,
        width: '100%',
        ...Platform.select({
            web: { cursor: 'pointer', transition: 'all 0.2s ease-in-out', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
            android: { elevation: 3 }
        })
    },
    cajaEncuestasCompletada: {
        backgroundColor: '#0a0a0a',
        borderColor: 'rgba(40, 167, 69, 0.3)',
        opacity: 0.8,
    },
    tittleTextSurvey: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    tittleTextSurveyDesktop: {
        fontSize: 24,
    },
    textoEstado: {
        fontSize: 15,
        marginTop: 8,
        letterSpacing: 0.3,
        color: colors.textSecondary,
    },

    // ========== BOTONES DE RESULTADOS / ANÁLISIS (web) ==========
    botonResultados: {
        backgroundColor: 'rgba(91, 85, 192, 0.15)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    textoBotonResultados: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 13,
    },

    // ========== FORMULARIOS / CREATOR ==========
    inputTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        marginBottom: 20,
        width: '100%',
    },

    // ========== ESTILOS ANDROID (DASHBOARD Y LISTAS) ==========
    headerAndroid: { marginBottom: 25, paddingTop: 10 },
    saludoAndroid: { color: colors.textMain, opacity: 0.6, fontSize: 16, marginBottom: 4 },
    containerStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    cardStat: {
        flex: 1,
        backgroundColor: colors.darkCard,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderDark,
        marginHorizontal: 4,
        elevation: 4,
    },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.white },
    statLabel: { fontSize: 12, color: colors.textMain, opacity: 0.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    cajaEncuestasAndroid: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 },
            android: { backgroundColor: '#1A1A1A' }
        })
    },
    iconContainerAndroid: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    badgeAndroid: {
        backgroundColor: 'rgba(139, 195, 74, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(139, 195, 74, 0.3)',
    },
    floatingBtnContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.cta,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        ...Platform.select({ android: { elevation: 10 } })
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.secondary,
        marginHorizontal: 8,
    },

    // ========== UTILIDADES GENERALES ==========
    borde: { borderWidth: 1, borderColor: 'red' },
    borde2: { borderWidth: 1, borderColor: 'green' },
    borde3: { borderWidth: 1, borderColor: 'orange' },
    margen2: { marginTop: 20 },
    row: { flexDirection: 'row', alignItems: 'center' },
    fullWidth: { width: '100%' },
    maxWidth: { width: '100%' },
    maxHeigth: { height: '100%' },
    noJustify: { justifyContent: 'flex-start' },
});