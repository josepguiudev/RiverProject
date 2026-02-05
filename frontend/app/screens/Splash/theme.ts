import { SplashPageStyles } from './styles';
import { WINDOW_WIDTH } from '../../utils/device';
import { Theme } from '@react-navigation/native';

export const createSplashPageStyles =(
    theme: Theme,
    isWeb: boolean
): SplashPageStyles => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34363A',
    // Ejemplo: En web podrías querer un padding lateral mayor
    paddingHorizontal: isWeb ? 50 : 20,
  },
  title: {
    marginTop: 20,
    // Ajuste dinámico simple: si la pantalla es muy pequeña, baja el tamaño
    fontSize: WINDOW_WIDTH < 350 ? 18 : 22, 
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#CCCCCC',
    // En web a veces el texto queda muy largo, podemos limitarlo
    maxWidth: isWeb ? 400 : '100%',
    textAlign: 'center',
  },
});