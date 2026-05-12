import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const colors = {
  primary: '#5b55c0',
  secondary: '#7c4dff',
  background: '#0a0a0a',
  surface: '#161616',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#2a2a2a',
  blue: '#4a90e2',
  danger: '#ff4d4d'
};

export default StyleSheet.create({
  // CONTENEDOR RAIZ RESPONSIVE
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
  // ESTILOS DE TEXTO GENERALES
  tituloHero: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tituloHeroDesktop: {
    fontSize: 42,
  },
  destaqueAzul: {
    color: colors.primary,
  },
  mainText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  texto: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  textoChico: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center', 
  },
  blueText: {
    color: colors.blue,
  },

  // AUTH / LOGIN COMPONENTS
  contendorLogoTitulos: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  contenedorWritter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cajaDesktop: {
    width: '100%',
    maxWidth: 500, 
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 24,
    alignSelf: 'center', 
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Nueva propiedad para evitar error en pantallas que usen cajaDesktop2
  cajaDesktop2: {
    width: '100%',
    maxWidth: 600, 
    padding: 30,
    backgroundColor: colors.surface,
    borderRadius: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // DASHBOARD / CARDS
  cajaEncuestas: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    // Ajuste para evitar solapamiento en Dashboard
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', 
    gap: 10,
    ...Platform.select({
      web: { cursor: 'default' as any }, // Corregido para TS
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 3 }
    })
  },
  tittleTextSurvey: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
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
    gap: 8
  },
  textoBotonResultados: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },

  // FORMULARIOS / CREATOR
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
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    backgroundColor: 'transparent',
  },

  // UTILIDADES RESPONSIVE / MÁRGENES
  margen2: {
    marginVertical: 20,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  }
});