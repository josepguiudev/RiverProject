import React from 'react';
import {
    View, Text, StyleSheet,
    ScrollView, ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';

interface Game {
    appid: number;
    title?: string;
    name?: string; // Steam API a veces devuelve "name"
}

interface Props {
    games: Game[];
    loading: boolean;
    isMobile: boolean;
}

export default function TopGamesCard({ games, loading, isMobile }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top Juegos Semana</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#5b55c0" />
            ) : games.length === 0 ? (
                <Text style={styles.emptyText}>Sin datos de juegos</Text>
            ) : isMobile ? (
                // ── Móvil: scroll horizontal ──────────────────────────────
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {games.map((game) => (
                        <View key={game.appid} style={styles.scrollItem}>
                            <Image
                                source={{
                                    uri: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`
                                }}
                                style={styles.scrollImage}
                                contentFit="cover"
                            />
                            {(game.title || game.name) && (
                                <Text style={styles.gameTitle} numberOfLines={1}>
                                    {game.title || game.name}
                                </Text>
                            )}
                        </View>
                    ))}
                </ScrollView>
            ) : (
                // ── Desktop: escalera superpuesta ─────────────────────────
                <View style={styles.staircaseWrapper}>
                    {games.map((game, index) => (
                        <Image
                            key={game.appid}
                            source={{
                                uri: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`
                            }}
                            style={[
                                styles.staircaseImage,
                                {
                                    top:    index * 30,
                                    left:   index * 20,
                                    zIndex: 3 - index,
                                    opacity: 1 - index * 0.15,
                                }
                            ]}
                            contentFit="cover"
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#263238',
        padding: 16,
        shadowColor: '#5b55c0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 14,
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },

    // Móvil — scroll horizontal
    scrollContent: {
        gap: 12,
        paddingRight: 8,
    },
    scrollItem: {
        alignItems: 'center',
        gap: 6,
    },
    scrollImage: {
        width: 140,
        height: 80,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#263238',
    },
    gameTitle: {
        color: '#a2a8d3',
        fontSize: 11,
        width: 140,
        textAlign: 'center',
    },

    // Desktop — escalera
    staircaseWrapper: {
        position: 'relative',
        width: 200,
        height: 150,
        alignSelf: 'center',
    },
    staircaseImage: {
        position: 'absolute',
        width: 160,
        height: 75,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#0e0d0d',
    },

    emptyText: {
        color: '#a2a8d3',
        fontStyle: 'italic',
    },
});
