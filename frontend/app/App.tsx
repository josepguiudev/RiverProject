// app/App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from './screens/Auth/AuthContext';

// 1. Importaciones de tus pantallas

import RegisterScreen from "./screens/Auth/RegisterScreen";
import SurveyCreatorScreen from "./screens/SurveyCreatorScreen";
import TakeSurveyScreen from "./screens/TakeSurveyScreen";
import SurveyListScreen from "./screens/SurveyListScreen";
import HomeScreen from "./screens/Home/HomeScreen";


import LoginScreen from "./screens/Auth/LoginScreen";
import Index from "./screens/index";

import AdminScreen from "./screens/Admin/AdminScreen";

// 2. INTERRUPTOR DIRECTO
// Cambia a true para ver Storybook, false para la App normal
//const SHOW_STORYBOOK = false;

const Stack = createNativeStackNavigator();

function App() {
	// Si el interruptor está activo, devolvemos Storybook
	/*
  if (SHOW_STORYBOOK) {
    const StorybookUI = require('../.rnstorybook').default;
    return <StorybookUI />;
  }
    */

	// Si no, devolvemos tu navegación normal
	return (
		<AuthProvider> {
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Login"
					screenOptions={{ headerShown: false }}
				>
					<Stack.Screen
						name="Index"
						component={Index}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Register" component={RegisterScreen} />
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Admin" component={AdminScreen} />
					<Stack.Screen
						name="SuerveyCreator"
						component={SurveyCreatorScreen}
					/>
					<Stack.Screen name="SurveyList" component={SurveyListScreen} />
					<Stack.Screen name="TakeSurvey" component={TakeSurveyScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		} </AuthProvider>
	);
}
export default App;
