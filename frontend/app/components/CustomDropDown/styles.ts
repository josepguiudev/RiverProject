import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Un poco más oscuro para centrar la atención
    justifyContent: 'center',
    alignItems: 'center', // 1. CENTRA el contenido horizontalmente
  },
  modalContent: {
    backgroundColor: '#1b2838', // Color azul Steam para que combine
    borderRadius: 12,
    padding: 8,
    width: '30%', // 2. LIMITA el ancho (ajusta este % según prefieras)
    maxHeight: '40%', // 3. Aumenta un poco esto para ver más de 2 opciones a la vez
    borderWidth: 1,
    borderColor: '#2a475e',
    elevation: 10, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a475e', // Color de línea más suave
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14, // Un poco más pequeño para que sea más fino
    textAlign: 'center', // Texto centrado queda más profesional en dropdowns
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 12,
    color: '#FFFFFF',
  },
});