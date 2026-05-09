// stylesGlobal.ts
import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const colors = {
    background: '#0e0d0df1',
    cardBg: '#263238',
    primary: '#5b55c0',
    secondary: '#3b82f6',
    accent: '#64B5F6',
    cta: '#8BC34A',
    textMain: '#F0F2F5',
    white: '#ffffff',
};

// Juntamos TODO en el StyleSheet.create
const styles = StyleSheet.create({
    alineadoPersonal: {
        flex: 1,
        backgroundColor: colors.background,
        width: '100%',
        ...Platform.select({
            web: { display: 'flex', minHeight: '100vh' as any, overflowY: 'auto' as any },
            default: { minHeight: '100%' }
        })
    },
    centeredContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    contendorLogoTitulos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    logo: {
        width: 80,
        height: 80,
    },
    contenedorWritter: {
        marginLeft: 15,
    },
    tituloHero: {
        fontSize: isWeb && width > 768 ? 60 : 40,
        fontWeight: '900',
        color: colors.primary,
    },
    tituloHeroDesktop: {
        fontSize: 80,
    },
    destaqueAzul: {
        color: colors.secondary,
    },
    caja: {
        backgroundColor: '#161616',
        borderRadius: 20,
        padding: 25,
        width: '90%',
        maxWidth: 450,
        alignItems: 'center',
    },
    cajaDesktop: {
        maxWidth: 500,
        padding: 40,
    },
    mainText: {
        color: colors.white,
        fontSize: 28,
        fontWeight: 'bold',
    },
    texto: {
        color: '#b0b0b0',
        fontSize: 16,
    },
    textoChico: {
        color: '#888',
        fontSize: 13,
    },
    blueText: {
        color: colors.secondary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // --- ESTILOS PARA LA LISTA DE ENCUESTAS ---
    cajaEncuestas: {
        backgroundColor: '#1c1c1c',
        borderRadius: 15,
        padding: 25,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
        // Esto añade el puntero de ratón en Web
        ...Platform.select({
            web: { cursor: 'pointer' as any }
        })
    },

    tittleTextSurvey: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Si usas tittleTextSurveyDesktop en el código, añádela también:
    tittleTextSurveyDesktop: {
        fontSize: 24,
    },

});

export default styles; // Exportación única