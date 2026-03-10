import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../app/components/auth/signin/signin';

const Stack = createNativeStackNavigator();

export default {
  title: 'Screens/Auth/SignIn',
  component: SignIn,
  decorators: [
    (Story: any) => (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={Story} />
          <Stack.Screen name="Register" component={() => <View />} />
        </Stack.Navigator>
      </NavigationContainer>
    ),
  ],
};

export const Default = () => <SignIn />;

// Historia para ver cómo queda el diseño en pantallas pequeñas
export const SmallScreen = () => (
  <View style={{ width: 320, height: '100%', alignSelf: 'center', borderWidth: 1 }}>
    <SignIn />
  </View>
);