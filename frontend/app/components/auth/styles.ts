import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

export const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
  },
  darkBackground: {
    flex: 1,
    backgroundColor: 'rgba(29, 39, 53, 0.96)', 
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
    // Eliminamos 'width: width' para evitar conflictos de cálculo nativo
  },
  formCard: {
    backgroundColor: '#263238',
    padding: 30,
    borderRadius: 28,
    // Usamos el ancho de la pantalla directamente con un límite si no es Android
    width: isAndroid ? width * 0.85 : '100%', 
    maxWidth: isAndroid ? undefined : 400, 
    alignSelf: 'center', 
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
    width: '100%', 
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