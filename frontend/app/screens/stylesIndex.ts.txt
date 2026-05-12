// app/screens/Auth/styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1D2735', // Fondo principal
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380, // Ancho profesional para que no se estire demasiado
    backgroundColor: '#263238', // Color "Barra de navegación"
    borderRadius: 35,
    padding: 40,
    alignItems: 'center',
    // Sombra premium
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
  logoBox: {
    width: 85,
    height: 85,
    backgroundColor: '#1D2735',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#64B5F6', // Azul claro de la paleta
  },
  logoLetter: {
    color: '#64B5F6',
    fontSize: 42,
    fontWeight: '800',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F0F2F5', // Texto principal
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
    gap: 14,
  },
  btnPrimary: {
    backgroundColor: '#8BC34A', // CTA Verde Lima
    width: '90%', // Tamaño centralizado
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#1D2735', // Texto oscuro sobre fondo claro
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
    borderColor: '#F0F2F5', // Borde con color de texto principal
  },
  btnSecondaryText: {
    color: '#F0F2F5',
    fontSize: 15,
    fontWeight: '700',
  }
});