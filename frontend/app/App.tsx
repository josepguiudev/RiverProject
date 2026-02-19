// app/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/*import HomeScreen from './screens/Home/HomeScreen';*/
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import SurveyCreatorScreen from './screens/SurveyCreatorScreen';
import HomeScreen from './screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>                   
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SuerveyCreator" component={SurveyCreatorScreen} />     
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  

/*
<Stack.Screen name="Home" component={HomeScreen} />
<AppNavigator />
*/

/*
//nuevo app para pruebas moha
import React from 'react';
<<<<<<< HEAD
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SimpleFormScreen from './screens/SurveyCreatorScreen';
import { View, StatusBar, StyleSheet } from 'react-native';
import SimpleFormScreen from './screens/SimpleFormScreen';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <SimpleFormScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;

*/