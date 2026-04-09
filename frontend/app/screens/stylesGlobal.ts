import { isWeb } from './../utils/device';
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
        alignItems: 'center',
        flexDirection: isWeb ? 'row' : 'column',
        justifyContent: 'center',
        // 'auto' permite que en móvil la caja crezca según el tamaño del logo y el texto
        height: isWeb ? 120 : 'auto', 
        padding: 10,
        marginBottom: isWeb ? 0 : 20,
    },
    containerFoto: {
        width: 80,
        height: 80, // Evita porcentajes aquí si el padre es 'auto'
    },
    logo: {
        // En móvil le damos un tamaño fijo de 100x100. En web puede mantener su lógica.
        width: isWeb ? 100 : 100, 
        height: isWeb ? '100%' : 100, 
        resizeMode: 'contain',
        marginBottom: isWeb ? 0 : 10,
    },

    // --- TEXTOS HERO Y TYPEWRITER ---
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
    contenedorListado: {
        width: '100%',
        maxWidth: 1000,           // Limita el ancho en monitores para que no se vea infinito
        alignSelf: 'center',      // Centra el listado en el monitor
        paddingHorizontal: 20,
        marginTop: 20,
    },

    cajaEncuestas: {
        backgroundColor: '#161616', 
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 85, 192, 0.2)', 
        padding: 35,              // Mucho más aire interno para monitores
        width: '100%',
        // Efecto de elevación sutil para que no parezca plano en PC
        ...Platform.select({
            web: {
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }
        })
    },

    cajaEncuestasCompletada: {
        backgroundColor: '#0a0a0a', 
        borderColor: 'rgba(40, 167, 69, 0.3)',
        opacity: 0.8,
    },

    tittleTextSurvey: {
        color: colors.white,
        fontSize: 20,             // Texto más grande para monitor
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    tittleTextSurveyDesktop: {
        fontSize: 24,             // Aún más grande en modo desktop real
    },

    textoEstado: {               // Nueva clase para los textos de "Pendiente/Completada"
        fontSize: 15,
        marginTop: 8,
        letterSpacing: 0.3,
    },

    // --- BORDES DE DEPURACIÓN (Debug) ---
    borde: { borderWidth: 1, borderColor: 'red' },
    borde2: { borderWidth: 1, borderColor: 'green' },
    borde3: { borderWidth: 1, borderColor: 'orange' },




});