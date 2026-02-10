
//nuevo app para pruebas moha
import React from 'react';
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


/* old app.tsx el de pepe
// app/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './navigation/AppNavigator';




export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
  */