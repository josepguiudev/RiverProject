// app/App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./screens/Auth/AuthContext";

// Importo TanStack Query para usarlo en toda la app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Y le creo uun cliente para guardar el cache de las consultas
const queryClient = new QueryClient();

/**
 * Configuración de Linking para persistencia de URLs en Web.
 * Esto permite que al recargar la página se mantenga la pantalla actual.
 */
const linking = {
  prefixes: ["http://localhost:8081", "river://"], // Ajusta según tu puerto de desarrollo
  config: {
    screens: {
      // Stack de Invitado
      Login: "login",
      Register: "register",
      
      // Stack de Empresa
      ClientDashboard: "dashboard",
      SurveyCreator: "create-survey",
      SurveyAnalytics: "analytics",
      
      // Stack de Jugador (Onboarding)
      CompleteProfile: "complete-profile",
      ConnectSteam: "connect-steam",
      
      // Stack de Jugador (Principal)
      SurveyList: "surveys",
      Home: "home",
      TakeSurvey: "survey/:surveyId",
      
      // Stack de Admin
      Admin: "admin",
      AdminUser: "admin/users",
      
      // Comunes
      Profile: "profile",
    },
  },
};

// 1. Importaciones de tus pantallas

import RegisterScreen from "./screens/Auth/RegisterScreen";
import SurveyCreatorScreen from "./screens/SurveyCreatorScreen";
import TakeSurveyScreen from "./screens/TakeSurveyScreen";
import SurveyListScreen from "./screens/SurveyListScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import ClientDashboard from "./screens/ClientDashboard";
import CompleteProfile from "./screens/CompleteProfileScreen";
import ConnectSteam from "./screens/ConnectSteamScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";

import LoginScreen from "./screens/Auth/LoginScreen";
import Index from "./screens/index";

import AdminScreen from "./screens/Admin/AdminScreen";
import AdminUserScreen from "./screens/Admin/AdminUserScreen";

// 2. INTERRUPTOR DIRECTO
// Cambia a true para ver Storybook, false para la App normal
//const SHOW_STORYBOOK = false;

import { useAuth } from "./screens/Auth/AuthContext";
import { ActivityIndicator, View } from "react-native";
import SurveyAnalyticsScreen from "./screens/SurveyAnalyticsScreen";

const Stack = createNativeStackNavigator();

/**
 * Componente de Navegación Principal.
 * Decide qué pantallas mostrar al usuario basándose en su estado de autenticación y su rol.
 */
function Navigation() {
  const { user, loading } = useAuth();

  // Mientras se cargan los datos de sesión (AsyncStorage), mostramos un indicador de carga
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F172A",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        /**
         * STACK DE INVITADO: El usuario no ha iniciado sesión.
         */
        <>
          {/* <Stack.Screen name="Index" component={Index} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === "CLIENT" ? (
        /**
         * STACK DE EMPRESA: El usuario es un cliente corporativo.
         */
        <>
          <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
          <Stack.Screen name="SurveyCreator" component={SurveyCreatorScreen} />
          <Stack.Screen
            name="SurveyAnalytics"
            component={SurveyAnalyticsScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : user.role === "ADMIN" ? (
        /**
         * STACK DE ADMIN: El usuario tiene permisos de superadministrador.
         */
        <>
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="AdminUser" component={AdminUserScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        /**
         * STACK DE JUGADOR: El usuario es un jugador final (PLAYER).
         */
        <>
          {user.registrationStep && user.registrationStep < 3 ? (
            /**
             * FLUJO DE ONBOARDING: El jugador aún no ha completado su perfil o vinculado Steam.
             */
            <>
              {user.registrationStep === 1 && (
                <Stack.Screen
                  name="CompleteProfile"
                  component={CompleteProfile}
                />
              )}
              {user.registrationStep === 2 && (
                <Stack.Screen name="ConnectSteam" component={ConnectSteam} />
              )}
            </>
          ) : (
            /**
             * FLUJO PRINCIPAL JUGADOR: El jugador ya está totalmente registrado.
             */
            <>
              <Stack.Screen name="SurveyList" component={SurveyListScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="TakeSurvey" component={TakeSurveyScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
