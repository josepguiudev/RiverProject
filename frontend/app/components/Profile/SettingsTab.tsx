import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, ActivityIndicator,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ---- Tipos ----
interface UserData {
    name: string;
    apellido1: string;
    apellido2: string;
    email: string;
    edad: string;        // String para el TextInput; se parsea al enviar
    localizacion: string;
    steamId: string;
}

/** Datos que se envían al callback onSave (incluye contraseña si la quieren cambiar). */
export interface SavePayload {
    userData: UserData;
    passwordChange?: {
        currentPassword: string;
        newPassword: string;
    };
}

interface Props {
    /** Datos actuales del usuario (pueden venir de AuthContext o de la query). */
    initialData?: Partial<UserData>;
    /** Callback que la screen llama con los datos actualizados. */
    onSave?: (payload: SavePayload) => Promise<void>;
    isMobile: boolean;
}

// ---- Componente ----
export default function SettingsTab({ initialData, onSave, isMobile }: Props) {
    // Estado del formulario
    const [form, setForm] = useState<UserData>({
        name: initialData?.name ?? '',
        apellido1: initialData?.apellido1 ?? '',
        apellido2: initialData?.apellido2 ?? '',
        email: initialData?.email ?? '',
        edad: initialData?.edad ?? '',
        localizacion: initialData?.localizacion ?? '',
        steamId: initialData?.steamId ?? '',
    });

    // Contraseña (campos aparte para no mezclar con datos de perfil)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const [saving, setSaving] = useState(false);

    // Helpers
    const update = (key: keyof UserData, value: string) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        // Validaciones básicas
        if (!form.name.trim() || !form.email.trim()) {
            Alert.alert('Campos requeridos', 'El nombre y el email no pueden estar vacíos.');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
            return;
        }
        if (newPassword && !currentPassword) {
            Alert.alert('Error', 'Introduce tu contraseña actual para cambiarla.');
            return;
        }

        setSaving(true);
        try {
            // Preparamos el payload con datos de usuario + contraseña si aplica
            const payload: SavePayload = {
                userData: form,
                ...(newPassword ? {
                    passwordChange: {
                        currentPassword,
                        newPassword,
                    }
                } : {}),
            };

            if (onSave) {
                await onSave(payload);
            }
            Alert.alert('Guardado', 'Tus datos se han actualizado correctamente.');
            // Limpiar campos de contraseña tras éxito
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'No se pudieron guardar los cambios.');
        } finally {
            setSaving(false);
        }
    };

    // ---- Render helpers ----
    const renderInput = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        opts?: { secure?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric'; placeholder?: string; editable?: boolean }
    ) => (
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, opts?.editable === false && styles.inputDisabled]}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#555"
                placeholder={opts?.placeholder ?? ''}
                secureTextEntry={opts?.secure && !showPasswords}
                keyboardType={opts?.keyboardType ?? 'default'}
                editable={opts?.editable ?? true}
            />
        </View>
    );

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Sección: Datos personales ── */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="person-outline" size={18} color="#5b55c0" />
                    <Text style={styles.sectionTitle}>Datos Personales</Text>
                </View>

                <View style={isMobile ? styles.fieldColumn : styles.fieldRow}>
                    {renderInput('Nombre', form.name, v => update('name', v), { placeholder: 'Tu nombre' })}
                    {renderInput('Primer Apellido', form.apellido1, v => update('apellido1', v), { placeholder: 'Apellido 1' })}
                </View>
                <View style={isMobile ? styles.fieldColumn : styles.fieldRow}>
                    {renderInput('Segundo Apellido', form.apellido2, v => update('apellido2', v), { placeholder: 'Apellido 2' })}
                    {renderInput('Edad', form.edad, v => update('edad', v), { placeholder: '25', keyboardType: 'numeric' })}
                </View>
                {renderInput('Localización', form.localizacion, v => update('localizacion', v), { placeholder: 'Barcelona, España' })}
            </View>

            {/* ── Sección: Cuenta ── */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="mail-outline" size={18} color="#5b55c0" />
                    <Text style={styles.sectionTitle}>Cuenta</Text>
                </View>
                {renderInput('Email', form.email, v => update('email', v), { placeholder: 'usuario@ejemplo.com', keyboardType: 'email-address' })}
            </View>

            {/* ── Sección: Steam ID ── */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="game-controller-outline" size={18} color="#5b55c0" />
                    <Text style={styles.sectionTitle}>Vinculación Steam</Text>
                </View>
                {!form.steamId && (
                    <View style={{ backgroundColor: 'rgba(255,0,0,0.1)', padding: 10, borderRadius: 8, marginBottom: 10 }}>
                        <Text style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 'bold' }}>
                            No connection: No has vinculado tu cuenta de Steam.
                        </Text>
                    </View>
                )}
                {renderInput('Steam ID', form.steamId, v => update('steamId', v), { placeholder: '76561198xxxxxxxxx' })}
                <Text style={styles.hint}>
                    Introduce tu Steam ID de 17 dígitos para vincular tu perfil de Steam.
                    Puedes encontrarlo en la URL de tu perfil de Steam.
                </Text>
            </View>

            {/* ── Sección: Contraseña ── */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="lock-closed-outline" size={18} color="#5b55c0" />
                    <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
                    <TouchableOpacity
                        onPress={() => setShowPasswords(p => !p)}
                        style={styles.eyeBtn}
                    >
                        <Ionicons
                            name={showPasswords ? 'eye-off-outline' : 'eye-outline'}
                            size={18}
                            color="#a2a8d3"
                        />
                    </TouchableOpacity>
                </View>

                {renderInput('Contraseña actual', currentPassword, setCurrentPassword, { secure: true, placeholder: '••••••••' })}
                <View style={isMobile ? styles.fieldColumn : styles.fieldRow}>
                    {renderInput('Nueva contraseña', newPassword, setNewPassword, { secure: true, placeholder: '••••••••' })}
                    {renderInput('Confirmar contraseña', confirmPassword, setConfirmPassword, { secure: true, placeholder: '••••••••' })}
                </View>
            </View>

            {/* ── Botón Guardar ── */}
            <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveBtnText}>Guardar Cambios</Text>
                )}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

// ---- Estilos ----
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    content: {
        paddingTop: 8,
        paddingBottom: 40,
    },
    // Secciones
    section: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#263238',
        padding: 20,
        marginBottom: 16,
        shadowColor: '#5b55c0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    // Campos
    fieldGroup: {
        flex: 1,
        marginBottom: 12,
        minWidth: 200,
    },
    fieldRow: {
        flexDirection: 'row',
        gap: 16,
    },
    fieldColumn: {
        flexDirection: 'column',
    },
    label: {
        color: '#a2a8d3',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#12121e',
        color: '#ffffff',
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#2a2a4a',
        ...Platform.select({
            web: {
                outlineStyle: 'none' as any,
            },
        }),
    },
    inputDisabled: {
        opacity: 0.5,
    },
    hint: {
        color: '#666',
        fontSize: 12,
        marginTop: 6,
        lineHeight: 18,
    },
    // Ojo contraseña
    eyeBtn: {
        padding: 4,
    },
    // Botón guardar
    saveBtn: {
        backgroundColor: '#5b55c0',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#5b55c0',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 12,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
