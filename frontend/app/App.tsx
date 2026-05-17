import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from './screens/Auth/AuthContext';
import { ActivityIndicator, View } from "react-native";

// Importaciones de pantallas
import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import SurveyCreatorScreen from "./screens/SurveyCreatorScreen";
import TakeSurveyScreen from "./screens/TakeSurveyScreen";
import SurveyListScreen from "./screens/SurveyListScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import ClientDashboard from "./screens/ClientDashboard";
import CompleteProfile from "./screens/CompleteProfileScreen";
import ConnectSteam from "./screens/ConnectSteamScreen";
import AdminScreen from "./screens/Admin/AdminScreen";
import AdminUserScreen from "./screens/Admin/AdminUserScreen";
import AdminGenresGames from "./screens/Admin/AdminGenresGames";
import AdminGraphics from "./screens/Admin/AdminGraphics";

const Stack = createNativeStackNavigator();

function Navigation() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" }}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                /* STACK DE INVITADO */
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : user.role === "ADMIN" ? (
                /* STACK DE ADMINISTRADOR */
                <>
                    <Stack.Screen name="Admin" component={AdminScreen} />
                    <Stack.Screen name="AdminUser" component={AdminUserScreen} />
                    <Stack.Screen name="AdminGenresGames" component={AdminGenresGames} />
                    <Stack.Screen name="AdminGraphics" component={AdminGraphics} />
                    <Stack.Screen name="ClientDashboard" component={ClientDashboard} /> 
                </>
            ) : user.role === "CLIENT" ? (
                /* STACK DE EMPRESA */
                <>
                    <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
                    <Stack.Screen name="SurveyCreator" component={SurveyCreatorScreen} />
                </>
            ) : (
                /* STACK DE USER (PLAYER) */
                <>
                    {user.registrationStep && user.registrationStep < 3 ? (
                        <>
                            {user.registrationStep === 1 && <Stack.Screen name="CompleteProfile" component={CompleteProfile} />}
                            {user.registrationStep === 2 && <Stack.Screen name="ConnectSteam" component={ConnectSteam} />}
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="SurveyList" component={SurveyListScreen} />
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="TakeSurvey" component={TakeSurveyScreen} />
                        </>
                    )}
                </>
            )}
        </Stack.Navigator>
    );
    }

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Navigation />
            </NavigationContainer>
        </AuthProvider>
    );
}