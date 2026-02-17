# 📚 Tutorial Completo: Sistema de Formularios - PARTE 2: FRONTEND

## 🎯 Frontend: React Native con TypeScript

Esta parte cubre la creación de la aplicación móvil que consume el API del backend.

---

## 1. ¿Por qué React Native + TypeScript?

### 1.1 React Native

**Ventajas:**
- ✅ Una codebase para iOS y Android
- ✅ Desarrollo rápido con Hot Reload
- ✅ Performance casi nativa
- ✅ Ecosistema enorme (npm)

### 1.2 TypeScript

**Ventajas:**
- ✅ Detecta errores antes de ejecutar
- ✅ Autocompletado inteligente
- ✅ Refactoring seguro
- ✅ Mejor documentación del código

**Comparación:**

```javascript
// JavaScript - No hay errores hasta ejecutar
const user = { name: "Juan" };
console.log(user.email); // undefined (¡error silencioso!)

// TypeScript - Error en tiempo de desarrollo
interface User {
  name: string;
}
const user: User = { name: "Juan" };
console.log(user.email); // ❌ ERROR: Property 'email' does not exist
```

---

## 2. Estructura del Proyecto

```
FormularioApp/
├── src/
│   ├── types/              # Definiciones TypeScript
│   │   └── form.types.ts
│   ├── config/             # Configuración
│   │   └── api.config.ts
│   ├── services/           # Lógica de comunicación
│   │   └── api.service.ts
│   └── screens/            # Pantallas de la app
│       └── SimpleFormScreen.tsx
├── App.tsx                 # Componente raíz
├── tsconfig.json           # Configuración TypeScript
└── package.json            # Dependencias
```

---

## 3. Tipos TypeScript

### 3.1 Ubicación
`src/types/form.types.ts`

### 3.2 Código con Explicaciones

```typescript
// FormResponse: Estructura de datos del formulario
// Coincide con la clase Java en el backend
export interface FormResponse {
  // id?: number
  // El ? significa OPCIONAL
  // ¿Por qué? Al crear no tenemos ID, el servidor lo asigna
  id?: number;
  
  // Campos obligatorios (sin ?)
  nombre: string;
  email: string;
  
  // Fecha como string porque viene de JSON
  // Backend envía: "2024-01-15T10:30:00"
  fechaEnvio?: string;
}

// ApiResponse: Wrapper genérico para respuestas
// T es un tipo genérico (puede ser cualquier cosa)
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// FormState: Estado del formulario en el componente
// Solo lo que el usuario ingresa
export interface FormState {
  nombre: string;
  email: string;
}

// FormErrors: Mensajes de error por campo
export interface FormErrors {
  nombre?: string;
  email?: string;
}
```

### 3.3 Conceptos Clave de TypeScript

#### **Interfaces vs Types**

```typescript
// Interface (preferida para objetos)
interface User {
  name: string;
  age: number;
}

// Type (más flexible)
type User = {
  name: string;
  age: number;
};

type ID = number | string;  // Union type
type Callback = (data: string) => void;  // Function type
```

#### **Tipos Opcionales**

```typescript
interface User {
  id: number;        // Obligatorio
  name: string;      // Obligatorio
  email?: string;    // Opcional
}

// ✅ Válido
const user1: User = { id: 1, name: "Juan" };

// ✅ Válido
const user2: User = { id: 2, name: "Ana", email: "ana@email.com" };

// ❌ Error: falta 'name'
const user3: User = { id: 3 };
```

#### **Tipos Genéricos**

```typescript
// Función genérica
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const numbers = [1, 2, 3];
const first1 = getFirst(numbers);  // first1: number | undefined

const names = ["Juan", "Ana"];
const first2 = getFirst(names);    // first2: string | undefined
```

---

## 4. Configuración de API

### 4.1 Ubicación
`src/config/api.config.ts`

### 4.2 Código con Explicaciones

```typescript
// Configuración centralizada de la API
export const API_CONFIG = {
  // ⚠️ CAMBIAR POR TU IP LOCAL
  // ¿Cómo obtener tu IP?
  // - Windows: ipconfig
  // - Mac/Linux: ifconfig | grep inet
  //
  // ¿Por qué no localhost?
  // localhost en el emulador apunta al EMULADOR, no a tu PC
  BASE_URL: 'http://192.168.1.100:8080',
  
  // Endpoints centralizados
  ENDPOINTS: {
    SUBMIT_FORM: '/api/forms/submit',
    GET_RESPONSES: '/api/forms/responses',
    TEST: '/api/forms/test',
  },
  
  // Timeout en milisegundos
  TIMEOUT: 10000,
};

// Helper para construir URLs completas
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
```

### 4.3 Conceptos Clave

#### **¿Por qué centralizar?**

```typescript
// ❌ Malo: URLs hardcodeadas
axios.post('http://192.168.1.100:8080/api/forms/submit', data);
axios.get('http://192.168.1.100:8080/api/forms/responses');

// ✅ Bueno: Configuración centralizada
axios.post(getFullUrl(API_CONFIG.ENDPOINTS.SUBMIT_FORM), data);
axios.get(getFullUrl(API_CONFIG.ENDPOINTS.GET_RESPONSES));

// Si cambias de servidor, solo modificas un archivo
```

#### **Localhost vs IP en móviles**

```
Web (navegador):
http://localhost:3000 → Tu PC ✅

Móvil (emulador):
http://localhost:3000 → El emulador mismo ❌
http://192.168.1.100:3000 → Tu PC ✅

Excepciones:
- Android Emulator: 10.0.2.2 apunta al host
- iOS Simulator: localhost funciona
```

---

## 5. Servicio de API

### 5.1 Ubicación
`src/services/api.service.ts`

### 5.2 Código con Explicaciones (Parte 1)

```typescript
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { FormResponse } from '../types/form.types';

// Crear instancia de axios con configuración por defecto
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clase de servicio con métodos estáticos
export class FormApiService {
  
  // Enviar formulario
  static async submitForm(formData: FormResponse): Promise<FormResponse> {
    try {
      // axios.post hace:
      // 1. Convierte formData a JSON
      // 2. Envía HTTP POST
      // 3. Espera respuesta
      // 4. Convierte JSON a objeto TypeScript
      const response = await apiClient.post<FormResponse>(
        API_CONFIG.ENDPOINTS.SUBMIT_FORM,
        formData
      );
      
      // response.data contiene el objeto retornado
      return response.data;
      
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Obtener todas las respuestas
  static async getAllResponses(): Promise<FormResponse[]> {
    try {
      const response = await apiClient.get<FormResponse[]>(
        API_CONFIG.ENDPOINTS.GET_RESPONSES
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Probar conexión
  static async testConnection(): Promise<string> {
    try {
      const response = await apiClient.get<string>(
        API_CONFIG.ENDPOINTS.TEST
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // Manejo centralizado de errores
  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // El servidor respondió con error (4xx, 5xx)
      if (axiosError.response) {
        return new Error(
          `Error del servidor: ${axiosError.response.status}`
        );
      } 
      
      // No hubo respuesta (timeout, red caída)
      else if (axiosError.request) {
        return new Error(
          'No se pudo conectar al servidor. Verifica tu conexión.'
        );
      }
    }
    
    // Error desconocido
    return new Error('Error inesperado al comunicarse con el servidor');
  }
}
```

### 5.3 Conceptos Clave

#### **Async/Await Explicado**

```typescript
// Sin async/await (callback hell)
function getData() {
  readFile('file.txt', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      processData(data, (err, processed) => {
        if (err) {
          console.error(err);
        } else {
          saveData(processed, (err, result) => {
            // ¡Pirámide de la perdición!
            console.log(result);
          });
        }
      });
    }
  });
}

// Con async/await (limpio)
async function getData() {
  try {
    const data = await readFile('file.txt');
    const processed = await processData(data);
    const result = await saveData(processed);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
```

#### **Manejo de errores HTTP**

```typescript
// Estructura de error de Axios
{
  response: {          // Si el servidor respondió
    data: {...},
    status: 404,
    statusText: 'Not Found'
  },
  request: {...},      // Si se envió pero no hubo respuesta
  message: 'Network Error'
}

// Manejo por código
try {
  await axios.get('/api/user/999');
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 400: console.log('Datos inválidos'); break;
        case 401: console.log('No autenticado'); break;
        case 404: console.log('No encontrado'); break;
        case 500: console.log('Error del servidor'); break;
      }
    } else if (error.request) {
      console.log('Sin conexión');
    }
  }
}
```

---

## 6. Pantalla de Formulario

### 6.1 Ubicación
`src/screens/SimpleFormScreen.tsx`

### 6.2 Código con Explicaciones (Parte 1: Estado)

```typescript
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { FormApiService } from '../services/api.service';
import { FormState, FormErrors, FormResponse } from '../types/form.types';

const SimpleFormScreen: React.FC = () => {
  
  // Hook useState: Gestión de estado
  // Sintaxis: const [valor, setValor] = useState(inicial);
  
  // Estado: Datos del formulario
  const [formData, setFormData] = useState<FormState>({
    nombre: '',
    email: '',
  });

  // Estado: Errores de validación
  const [errors, setErrors] = useState<FormErrors>({});

  // Estado: Indicador de carga
  const [loading, setLoading] = useState<boolean>(false);
```

### 6.3 Código con Explicaciones (Parte 2: Validación)

```typescript
  // Validar email con regex
  const validateEmail = (email: string): boolean => {
    // Expresión regular explicada:
    // ^          → Inicio
    // [^\s@]+    → Uno o más caracteres que NO sean espacio ni @
    // @          → El @
    // [^\s@]+    → Uno o más caracteres que NO sean espacio ni @
    // \.         → Un punto
    // [^\s@]+    → Uno o más caracteres
    // $          → Fin
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    
    // Retornar si es válido
    // Object.keys(newErrors).length === 0 → No hay errores
    return Object.keys(newErrors).length === 0;
  };
```

### 6.4 Código con Explicaciones (Parte 3: Actualización)

```typescript
  // Actualizar un campo
  const updateField = (field: keyof FormState, value: string): void => {
    // Actualización INMUTABLE de estado
    // NUNCA: formData.nombre = value;
    // SIEMPRE: setFormData con nuevo objeto
    setFormData(prev => ({
      ...prev,      // Copia todo lo anterior
      [field]: value,  // Sobrescribe solo este campo
    }));

    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };
```

### 6.5 Código con Explicaciones (Parte 4: Envío)

```typescript
  // Enviar formulario
  const handleSubmit = async (): Promise<void> => {
    // 1. Validar
    if (!validateForm()) {
      Alert.alert('Error', 'Corrige los errores');
      return;
    }

    // 2. Mostrar loading
    setLoading(true);

    try {
      // 3. Preparar datos
      const dataToSend: FormResponse = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      // 4. Enviar al servidor
      const response = await FormApiService.submitForm(dataToSend);
      
      console.log('✅ Guardado:', response);

      // 5. Mostrar éxito
      Alert.alert(
        '✅ Éxito',
        `ID: ${response.id}`,
        [{ text: 'OK', onPress: resetForm }]
      );
      
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert(
        '❌ Error',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      // 6. Siempre quitar loading
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = (): void => {
    setFormData({ nombre: '', email: '' });
    setErrors({});
  };
```

### 6.6 Código con Explicaciones (Parte 5: UI)

```typescript
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          
          {/* Header */}
          <Text style={styles.title}>Formulario Simple</Text>
          
          {/* Campo Nombre */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nombre <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.nombre && styles.inputError,
              ]}
              placeholder="Tu nombre"
              value={formData.nombre}
              onChangeText={(value) => updateField('nombre', value)}
              editable={!loading}
            />
            {errors.nombre && (
              <Text style={styles.errorText}>{errors.nombre}</Text>
            )}
          </View>

          {/* Campo Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
              ]}
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Botón de envío */}
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Enviar</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```

### 6.7 Estilos

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SimpleFormScreen;
```

---

## 7. Hooks de React

### 7.1 useState Explicado

```typescript
// Declaración
const [valor, setValor] = useState(inicial);

// Ejemplo
const [count, setCount] = useState(0);

// Leer
console.log(count);  // 0

// Actualizar
setCount(1);         // count ahora es 1
setCount(prev => prev + 1);  // count ahora es 2

// Cuando cambias el estado, React re-renderiza el componente
```

### 7.2 Flujo de re-renderizado

```
1. Usuario escribe "Juan" en input
2. onChangeText llama a updateField('nombre', 'Juan')
3. updateField llama a setFormData
4. formData cambia de {nombre: ''} a {nombre: 'Juan'}
5. React detecta el cambio
6. React vuelve a ejecutar el componente (re-render)
7. El input muestra "Juan"
```

---

## 8. Flujo Completo Cliente-Servidor

```
Usuario presiona "Enviar"
        ↓
handleSubmit() valida datos
        ↓
FormApiService.submitForm(data)
        ↓
axios.post() envía JSON por HTTP
        ↓
[INTERNET/RED LOCAL]
        ↓
Spring Boot recibe en FormController
        ↓
@PostMapping deserializa JSON → FormResponse
        ↓
FormController → FormService → FormRepository
        ↓
JPA guarda en base de datos
        ↓
Retorna FormResponse con ID
        ↓
Spring serializa FormResponse → JSON
        ↓
[INTERNET/RED LOCAL]
        ↓
axios recibe respuesta
        ↓
Deserializa JSON → objeto TypeScript
        ↓
handleSubmit() muestra mensaje de éxito
        ↓
Usuario ve "✅ Formulario enviado"
```

---

## 9. Configurar TypeScript

### 9.1 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js"
  ]
}
```

---

## 10. Ejecutar la App

### 10.1 Instalar dependencias
```bash
npm install
npm install axios
```

### 10.2 Ejecutar
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### 10.3 Verificar conexión
1. Presiona "Probar Conexión"
2. Debe mostrar "Backend funcionando correctamente!"
3. Si falla, verifica la IP en api.config.ts

---

## ✅ Resumen Frontend

Has aprendido:
1. ✅ TypeScript: Tipos, interfaces, genéricos
2. ✅ React Hooks: useState
3. ✅ Comunicación HTTP con axios
4. ✅ Validación de formularios
5. ✅ Manejo de estado
6. ✅ Estilos con StyleSheet

---

## 🎓 Conceptos Clave Finales

### Separación de Responsabilidades

```
Screen (UI)
  ├─ Maneja interacciones del usuario
  ├─ Gestiona estado local
  └─ Llama a services
  
Service (Lógica)
  ├─ Comunicación con API
  ├─ Transformación de datos
  └─ Manejo de errores
  
Config (Configuración)
  └─ URLs, constantes, ajustes
  
Types (Contratos)
  └─ Definiciones de datos
```

### Estado Inmutable

```typescript
// ❌ Mal: Mutar directamente
formData.nombre = "Juan";

// ✅ Bien: Crear nuevo objeto
setFormData({ ...formData, nombre: "Juan" });
```

### Async/Await

```typescript
// Código asíncrono se ve síncrono
const data = await fetchData();
console.log(data);

// Equivalente con .then()
fetchData().then(data => {
  console.log(data);
});
```

---

**¡Felicidades! Has completado el tutorial completo. 🎉**

Ahora tienes un sistema funcional de formularios con:
- Backend robusto con Spring Boot
- Frontend móvil con React Native
- Comunicación HTTP con REST API
- TypeScript para seguridad de tipos
