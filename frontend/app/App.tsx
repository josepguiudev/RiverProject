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
import ClientDashboard from "./screens/ClientDashboard";
import CompleteProfile from "./screens/CompleteProfileScreen"
import ConnectSteam from "./screens/ConnectSteamScreen"
import AdminGraphics from "./screens/Admin/AdminGraphics";



import LoginScreen from "./screens/Auth/LoginScreen";

import AdminScreen from "./screens/Admin/AdminScreen";
import AdminUserScreen from "./screens/Admin/AdminUserScreen";
import AdminGenresGames from "./screens/Admin/AdminGenresGames";

import SimpleFormScreen from "./screens/SimpleFormScreen";



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
		<AuthProvider> 
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Login"
					screenOptions={{ headerShown: false }}
				>
					
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="Register" component={RegisterScreen} />
					<Stack.Screen name="CrearEncuesta" component={ClientDashboard} />
					<Stack.Screen name="Admin" component={AdminScreen} />
					<Stack.Screen name="AdminUser" component={AdminUserScreen} />
					<Stack.Screen name="AdminGenresGames" component={AdminGenresGames} />
					<Stack.Screen name="AdminGraphics" component={AdminGraphics} />
					<Stack.Screen name="ClientDashboard" component={ClientDashboard} />
					<Stack.Screen name="SurveyCreator" component={SurveyCreatorScreen}/>
					<Stack.Screen name="SurveyList" component={SurveyListScreen} />
					<Stack.Screen name="TakeSurvey" component={TakeSurveyScreen} />
					<Stack.Screen name="CompleteProfile" component={CompleteProfile} />
					<Stack.Screen name="ConnectSteam" component={ConnectSteam} />

				</Stack.Navigator>
			</NavigationContainer>
		 </AuthProvider>
	);
}
export default App;
