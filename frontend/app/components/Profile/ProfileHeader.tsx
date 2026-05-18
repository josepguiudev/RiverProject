import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    profile: any;
    loading: boolean;
}

export default function ProfileHeader({ profile, loading }: Props) {

    if (loading) {
        return (
            <View style={[styles.card, styles.centered]}>
                <ActivityIndicator size="small" color="#5b55c0" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={[styles.card, styles.centered]}>
                <Text style={styles.errorText}>No se pudo cargar el perfil de Steam</Text>
            </View>
        );
    }

    // personastate === 1 significa Online en la API de Steam
    const isOnline = profile.personastate === 1;

    return (
        <View style={styles.card}>
            {/* Avatar */}
            <Image
                source={{ uri: profile.avatarFull || profile.avatar }}
                style={styles.avatar}
                contentFit="cover"
            />

            {/* Datos del usuario */}
            <View style={styles.infoContainer}>
                <Text style={styles.username}>{profile.personaName || profile.personaname}</Text>
                <Text style={styles.steamId}>ID: {profile.steamId || profile.steamid}</Text>

                {/* Indicador de estado Online/Offline */}
                {/* 
                // TODO: Comentado temporalmente (estado online/offline) porque creo que petará.
                <View style={styles.statusRow}>
                    <Ionicons
                        name="ellipse"
                        size={10}
                        color={isOnline ? '#8BC34A' : '#546E7A'}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[
                        styles.statusText,
                        { color: isOnline ? '#8BC34A' : '#a2a8d3' }
                    ]}>
                        {isOnline ? 'Online en Steam' : 'Offline'}
                    </Text>
                </View>
                */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#263238',
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#5b55c0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 15,
    },
    centered: {
        justifyContent: 'center',
        height: 100,
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        borderWidth: 2,
        borderColor: '#5b55c0',
        marginRight: 18,
    },
    infoContainer: {
        flex: 1,
        gap: 4,
    },
    username: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    steamId: {
        color: '#a2a8d3',
        fontSize: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    errorText: {
        color: '#a2a8d3',
        fontStyle: 'italic',
    },
});
