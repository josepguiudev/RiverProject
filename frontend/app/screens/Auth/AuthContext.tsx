import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'CLIENT';
  registrationStep?: number; // 1, 2 o 3
}

interface AuthContextData {
  user: User | null;
  token: string | null; // 1. Agregado a la interfaz
  loading: boolean;
  login: (userData: any, token: string, role: string, step: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // 2. Estado para el token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      // Cargamos tanto el usuario como el token al arrancar
      const [storageUser, storageToken] = await Promise.all([
        AsyncStorage.getItem('@River:user'),
        AsyncStorage.getItem('@River:token')
      ]);

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setToken(storageToken); // 3. Seteamos el token en el estado
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const login = async (userData: any, token: string, role: string, step: number) => {
    const completeUser: User = { ...userData, role, registrationStep: step };
    
    // 4. Guardamos en el estado
    setUser(completeUser);
    setToken(token);

    // 5. Guardamos en el almacenamiento persistente
    await AsyncStorage.setItem('@River:user', JSON.stringify(completeUser));
    await AsyncStorage.setItem('@River:token', token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@River:user');
    await AsyncStorage.removeItem('@River:token');
    setUser(null);
    setToken(null);
  };

  return (
    // 6. Pasamos 'token' en el Provider
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}