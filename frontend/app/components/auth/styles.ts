import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
  },
  darkBackground: {
    flex: 1,
    backgroundColor: 'rgba(29, 39, 53, 0.96)', 
    justifyContent: 'center', // Centrado vertical
    alignItems: 'center',     // Centrado horizontal clave
  },
  scrollContainer: { 
    // Eliminamos el width fijo y usamos flexGrow para centrar el contenido
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
    width: width, // Ocupa el ancho de la pantalla para permitir el centrado interno
  },
  formCard: {
    backgroundColor: '#263238',
    padding: 30,
    borderRadius: 28,
    // 1. Centralización profesional:
    width: '100%',
    maxWidth: 400, // Evita que en tablets o web se vea gigante
    alignSelf: 'center', 
    
    // Sombras
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    marginBottom: -10,
    zIndex: 10,
  },
  closeButtonText: {
    color: '#64B5F6',
    fontSize: 26,
    fontWeight: '300',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#F0F2F5', 
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64B5F6',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F0F2F5',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: '#1D2735',
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 20, 
    fontSize: 16,
    color: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#37474F'
  },
  button: { 
    backgroundColor: '#8BC34A',
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10,
    width: '100%', // El botón ocupa el ancho de la card
  },
  buttonDisabled: {
    backgroundColor: '#558B2F',
    opacity: 0.6
  },
  buttonText: { 
    color: '#1D2735', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  footerLink: { 
    marginTop: 25, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#F0F2F5', 
    fontSize: 14 
  },
  linkTextBold: { 
    color: '#8BC34A', 
    fontWeight: '700' 
  }
});