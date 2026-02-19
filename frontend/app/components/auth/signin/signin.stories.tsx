import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './signin';

const Stack = createNativeStackNavigator();
//ede

export default {
  title: 'Screens/Auth/SignIn',
  component: SignIn,
  decorators: [
    (Story: any) => (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={Story} />
          {/* Mock de la pantalla de registro por si haces click en el link */}
          <Stack.Screen name="Register" component={() => <View />} />
        </Stack.Navigator>
      </NavigationContainer>
    ),
  ],
};

export const Default = () => <SignIn />;

export const LoadingState = () => {
    // Aquí podrías forzar un estado si tuvieras props de loading, 
    // pero por ahora usamos la versión por defecto.
    return <SignIn />;
};