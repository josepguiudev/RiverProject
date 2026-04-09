import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos qué datos tiene un usuario
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al abrir la app, miramos si ya había alguien logueado
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@River:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (userData: User, token: string) => {
    setUser(userData);
    await AsyncStorage.setItem('@River:user', JSON.stringify(userData));
    await AsyncStorage.setItem('@River:token', token);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Este es el "hook" que usamos en TakeSurvey y SurveyList
export function useAuth() {
  return useContext(AuthContext);
}