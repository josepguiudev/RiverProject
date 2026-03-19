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
import { useLayout } from '../utils/useLayout';

/**
 * Pantalla de formulario simple
 * Permite al usuario ingresar nombre y email, y enviarlos al backend
 */
const SimpleFormScreen: React.FC = () => {
  const { isDesktopView, isTabletView } = useLayout();

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
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validar todos los campos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Actualizar un campo del formulario
   */
  const updateField = (field: keyof FormState, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

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
    if (!validateForm()) {
      Alert.alert('Error de validación', 'Por favor corrige los errores');
      return;
    }

    setLoading(true);

    try {
      const dataToSend: FormResponse = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      const response = await FormApiService.submitForm(dataToSend);

      Alert.alert(
        '✅ Éxito',
        `Formulario enviado correctamente!\nID: ${response.id}`,
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      Alert.alert('❌ Error', 'No se pudo enviar el formulario');
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
      Alert.alert('❌ Error de conexión', 'No se puede conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear formulario a valores iniciales
   */
  const resetForm = (): void => {
    setFormData({ nombre: '', email: '' });
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isDesktopView && styles.scrollContentDesktop]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.formContainer, isDesktopView && styles.formContainerDesktop]}>
          <Text style={[styles.title, isDesktopView && styles.titleDesktop]}>Formulario Simple</Text>
          <Text style={[styles.subtitle, isDesktopView && styles.subtitleDesktop]}>
            Prueba de conexión con Spring Boot usando TypeScript
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputError, isDesktopView && styles.inputDesktop]}
              placeholder="Tu nombre completo"
              value={formData.nombre}
              onChangeText={(value) => updateField('nombre', value)}
              editable={!loading}
              autoCapitalize="words"
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError, isDesktopView && styles.inputDesktop]}
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>📤 Enviar Formulario</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.testButton]} onPress={testConnection} disabled={loading}>
            <Text style={styles.buttonText}>🔌 Probar Conexión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetForm} disabled={loading}>
            <Text style={styles.resetButtonText}>🔄 Limpiar Formulario</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1 },
  scrollContentDesktop: { alignItems: 'center', justifyContent: 'center' },
  formContainer: { padding: 20, marginTop: 40, width: '100%' },
  formContainerDesktop: { width: '50%', maxWidth: 600, padding: 40, backgroundColor: '#fff', borderRadius: 12, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  titleDesktop: { fontSize: 36, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30, lineHeight: 20 },
  subtitleDesktop: { fontSize: 18, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  required: { color: '#e74c3c' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
  inputDesktop: { padding: 16, fontSize: 18 },
  inputError: { borderColor: '#e74c3c', borderWidth: 2 },
  errorText: { color: '#e74c3c', fontSize: 12, marginTop: 4, marginLeft: 4 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' },
  submitButton: { backgroundColor: '#4CAF50' },
  testButton: { backgroundColor: '#2196F3' },
  resetButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#999' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resetButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
});

export default SimpleFormScreen;