import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../api/client';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'CLIENT' | 'ADMIN'; 
  registrationStep?: number;
  id_rol?: number; // Para verificar el rol 1
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: any, token: string, role: string, step: number) => Promise<void>;
  logout: () => Promise<void>;
  updateRegistrationStep: (step: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storageToken = await AsyncStorage.getItem('@River:token');

        if (storageToken) {
          // Validamos el token con el servidor
          const response = await client.get('/api/auth2/me', {
            headers: { Authorization: `Bearer ${storageToken}` }
          });

          // Extraemos los datos del LoginResponse de Java
          const { user: userData, role, registrationStep } = response.data;

          // Lógica de Rol 1 -> ADMIN
          const finalRole = (userData.id_rol === 1) ? 'ADMIN' : role;

          const currentUser: User = { 
            ...userData, 
            role: finalRole, 
            registrationStep 
          };

          setUser(currentUser);
          setToken(storageToken);
          
          await AsyncStorage.setItem('@River:user', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error("Sesión inválida o expirada");
        await AsyncStorage.multiRemove(['@River:user', '@River:token']);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const login = async (userData: any, token: string, role: string, step: number) => {
    const finalRole = (userData.id_rol === 1) ? 'ADMIN' : role;
    const completeUser: User = { ...userData, role: finalRole as any, registrationStep: step };
    
    setUser(completeUser);
    setToken(token);

    await AsyncStorage.setItem('@River:user', JSON.stringify(completeUser));
    await AsyncStorage.setItem('@River:token', token);
  };

  const updateRegistrationStep = async (step: number) => {
    if (user) {
      const updatedUser = { ...user, registrationStep: step };
      setUser(updatedUser);
      await AsyncStorage.setItem('@River:user', JSON.stringify(updatedUser));
    }
  };

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