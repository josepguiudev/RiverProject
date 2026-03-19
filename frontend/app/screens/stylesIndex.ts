// app/screens/Auth/styles.ts
import { StyleSheet, Dimensions } from 'react-native';
// Importamos tus constantes
import { isAndroid, isWeb } from '../utils/device'; 

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1D2735', 
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    // Si es Android, quitamos maxWidth para evitar crasheos de layout. En web lo mantenemos.
    maxWidth: isAndroid ? undefined : 380, 
    backgroundColor: '#263238', 
    borderRadius: 35,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 45,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F0F2F5', 
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64B5F6',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    // Usamos gap solo si NO es Android
    gap: isAndroid ? undefined : 14, 
  },
  btnPrimary: {
    backgroundColor: '#8BC34A', 
    width: '90%', 
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    // Si es Android, como no hay 'gap', le ponemos un margen inferior para separar los botones
    marginBottom: isAndroid ? 14 : 0,
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#F0F2F5', 
  },
  btnSecondaryText: {
    color: '#F0F2F5',
    fontSize: 15,
    fontWeight: '700',
  }
});