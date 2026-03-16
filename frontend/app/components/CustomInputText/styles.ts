import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E5E5', // text-neutral-200
    marginBottom: 8,
  },
  inputWrapper: {
    marginTop: "1%",
    backgroundColor: '#1C1C1C', // Fondo oscuro del input
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333', // Borde sutil
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    paddingHorizontal: 16,
    color: '#FFFFFF',
  },
});