//CLASE DE PRUEBA PARA PRACTICAR, NO ESSENCIAL

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FormApiService } from '../services/api/service';
import { FormState, FormErrors, FormResponse } from '../types/forms.types';
import { wp, hp, fontScale } from '../utils/device';

/**
 * Pantalla de formulario simple
 * Permite al usuario ingresar nombre y email, y enviarlos al backend
 */
const SimpleFormScreen: React.FC = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<FormState>({
    nombre: '',
    email: '',
  });

  // Estado de errores de validación
  const [errors, setErrors] = useState<FormErrors>({});

  // Estado de carga
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Validar email con expresión regular
   * @param email - Email a validar
   * @returns true si es válido, false si no
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validar todos los campos del formulario
   * @returns true si todo es válido, false si hay errores
   */
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

    // Si no hay errores, el formulario es válido
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Actualizar un campo del formulario
   * @param field - Campo a actualizar
   * @param value - Nuevo valor
   */
  const updateField = (field: keyof FormState, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Enviar formulario al backend
   */
  const handleSubmit = async (): Promise<void> => {
    // Validar antes de enviar
    if (!validateForm()) {
      Alert.alert('Error de validación', 'Por favor corrige los errores');
      return;
    }

    setLoading(true);

    try {
      // Crear objeto con los datos a enviar
      const dataToSend: FormResponse = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      // Llamar al servicio API
      const response = await FormApiService.submitForm(dataToSend);

      console.log('✅ Respuesta del servidor:', response);

      // Mostrar mensaje de éxito
      Alert.alert(
        '✅ Éxito',
        `Formulario enviado correctamente!\nID: ${response.id}`,
        [
          {
            text: 'OK',
            onPress: resetForm,
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error al enviar:', error);

      Alert.alert(
        '❌ Error',
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el formulario'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Probar conexión con el backend
   */
  const testConnection = async (): Promise<void> => {
    setLoading(true);

    try {
      const message = await FormApiService.testConnection();
      Alert.alert('✅ Conexión exitosa', message);
    } catch (error) {
      Alert.alert(
        '❌ Error de conexión',
        error instanceof Error
          ? error.message
          : 'No se puede conectar al servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear formulario a valores iniciales
   */
  const resetForm = (): void => {
    setFormData({
      nombre: '',
      email: '',
    });
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Header */}
          <Text style={styles.title}>Formulario Simple</Text>
          <Text style={styles.subtitle}>
            Prueba de conexión con Spring Boot usando TypeScript
          </Text>

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
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChangeText={(value) => updateField('nombre', value)}
              editable={!loading}
              autoCapitalize="words"
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
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Botón de envío */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>📤 Enviar Formulario</Text>
            )}
          </TouchableOpacity>

          {/* Botón de prueba */}
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={testConnection}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>🔌 Probar Conexión</Text>
          </TouchableOpacity>

          {/* Botón de reset */}
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetForm}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>🔄 Limpiar Formulario</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: wp(5),
    marginTop: hp(5),
  },
  title: {
    fontSize: fontScale(28),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: fontScale(14),
    color: '#666',
    marginBottom: hp(3.5),
    lineHeight: fontScale(20),
  },
  inputGroup: {
    marginBottom: hp(2.5),
  },
  label: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(1),
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: fontScale(16),
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: fontScale(12),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
  button: {
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(1.2),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  testButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#999',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#666',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
});

export default SimpleFormScreen;