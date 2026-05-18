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
  SafeAreaView,
} from 'react-native';
import { FormApiService } from '../services/api/service';
import { FormState, FormErrors } from '../types/forms.types';
import { Survey, Question } from '../types/formsSurvey.types';
import { useLayout } from '../utils/useLayout';
import { isWeb } from '../utils/device';
import { useAuth } from './Auth/AuthContext';

const SimpleFormScreen: React.FC = () => {
  const { isDesktopView } = useLayout();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormState>({
    nombre: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const updateField = (field: keyof FormState, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Error de validación', 'Por favor corrige los errores');
      return;
    }
    if (!user?.id) {
      Alert.alert('Error', 'Usuario no identificado');
      return;
    }
    setLoading(true);
    try {
      // Construcción correcta de la pregunta según los tipos
      const question: Question = {
        textQuestion: `Correo electrónico: ${formData.email.trim().toLowerCase()}`,
        config: {
          typeName: 'SHORT_TEXT',
          isMultiple: false,
          attributes: '',
        },
        option: [],
        options: [],
      };
      const surveyData: Survey = {
        name: formData.nombre.trim(),
        questionList: [question],
        numQuestions: 1,
        numUsers: 0,
        status: true, // boolean
        categoryList: [],
        genereList: [],
        launchDate: new Date().toISOString(),
        closeDate: '',
        creationDate: new Date().toISOString(),
        SurveyReward: 0,
      };

      const response = await FormApiService.submitForm(surveyData, user.id);
      Alert.alert(
        '✅ Éxito',
        `Formulario enviado correctamente!\nID de encuesta: ${response.id}`,
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      Alert.alert('❌ Error', 'No se pudo enviar el formulario');
    } finally {
      setLoading(false);
    }
  };

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

  const resetForm = (): void => {
    setFormData({ nombre: '', email: '' });
    setErrors({});
  };

  // ============================================================
  //  VERSIÓN WEB (original con estilos condicionales corregidos)
  // ============================================================
  if (isWeb) {
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
                style={[
                  styles.input,
                  isDesktopView && styles.inputDesktop,
                  errors.nombre ? styles.inputError : undefined,
                ]}
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
                style={[
                  styles.input,
                  isDesktopView && styles.inputDesktop,
                  errors.email ? styles.inputError : undefined,
                ]}
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
  }

  // ============================================================
  //  VERSIÓN ANDROID (diseño táctil)
  // ============================================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 4 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 }}>
              Formulario Simple
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              Prueba de conexión con Spring Boot usando TypeScript
            </Text>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                Nombre <Text style={{ color: '#e74c3c' }}>*</Text>
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#f9f9f9',
                  borderWidth: 1,
                  borderColor: errors.nombre ? '#e74c3c' : '#ddd',
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: '#333',
                }}
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChangeText={(value) => updateField('nombre', value)}
                editable={!loading}
                autoCapitalize="words"
              />
              {errors.nombre && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.nombre}</Text>}
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                Email <Text style={{ color: '#e74c3c' }}>*</Text>
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#f9f9f9',
                  borderWidth: 1,
                  borderColor: errors.email ? '#e74c3c' : '#ddd',
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: '#333',
                }}
                placeholder="tu@email.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.email && <Text style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 12,
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>📤 Enviar Formulario</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#2196F3',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 12,
              }}
              onPress={testConnection}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>🔌 Probar Conexión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: '#999',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 12,
              }}
              onPress={resetForm}
              disabled={loading}
            >
              <Text style={{ color: '#666', fontSize: 16, fontWeight: '600' }}>🔄 Limpiar Formulario</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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