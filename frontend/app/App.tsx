// app/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importaciones de tus pantallas
import SignIn from './components/auth/signin/signin'; 
import RegisterScreen from './screens/Auth/RegisterScreen';

// 2. INTERRUPTOR DIRECTO
// Cambia a true para ver Storybook, false para la App normal
const SHOW_STORYBOOK = true;

const Stack = createNativeStackNavigator();

function App() {
  // Si el interruptor está activo, devolvemos Storybook
  if (SHOW_STORYBOOK) {
    const StorybookUI = require('../.rnstorybook').default;
    return <StorybookUI />;
  }

  // Si no, devolvemos tu navegación normal
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={SignIn} /> 
        <Stack.Screen name="Register" component={RegisterScreen} />             
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;