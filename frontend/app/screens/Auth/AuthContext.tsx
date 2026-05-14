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
  updateRegistrationStep: (step: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Proveedor de Autenticación.
 * Gestiona el estado global del usuario, el token JWT y la persistencia en el almacenamiento local.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Estado para el token JWT
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando los datos de storage

  useEffect(() => {
    /**
     * Carga los datos guardados en AsyncStorage al arrancar la aplicación.
     * Esto permite que el usuario no tenga que loguearse cada vez que recarga.
     */
    async function loadStorageData() {
      const [storageUser, storageToken] = await Promise.all([
        AsyncStorage.getItem('@River:user'),
        AsyncStorage.getItem('@River:token')
      ]);

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        setToken(storageToken);
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  /**
   * Inicia sesión y guarda los datos en el estado y en el almacenamiento persistente.
   */
  const login = async (userData: any, token: string, role: string, step: number) => {
    const completeUser: User = { ...userData, role: role as any, registrationStep: step };
    
    setUser(completeUser);
    setToken(token);

    await AsyncStorage.setItem('@River:user', JSON.stringify(completeUser));
    await AsyncStorage.setItem('@River:token', token);
  };

  /**
   * Actualiza el paso de registro actual (onboarding) tanto en el estado como en storage.
   */
  const updateRegistrationStep = async (step: number) => {
    if (user) {
      const updatedUser = { ...user, registrationStep: step };
      setUser(updatedUser);
      await AsyncStorage.setItem('@River:user', JSON.stringify(updatedUser));
    }
  };

  /**
   * Cierra la sesión limpiando el estado y eliminando los datos de storage.
   */
  const logout = async () => {
    await AsyncStorage.removeItem('@River:user');
    await AsyncStorage.removeItem('@River:token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateRegistrationStep }}>
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