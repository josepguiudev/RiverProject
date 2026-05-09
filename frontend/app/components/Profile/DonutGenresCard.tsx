import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Genre {
    name: string;
    percentage: number;
    color: string;
}

interface Props {
    genres?: Genre[];
}

// Mock hasta que el backend devuelva géneros reales
const MOCK_GENRES: Genre[] = [
    { name: 'Shooter',    percentage: 35, color: '#e43f5a' },
    { name: 'RPG',        percentage: 25, color: '#5b55c0' },
    { name: 'Acción',     percentage: 20, color: '#64B5F6' },
    { name: 'Estrategia', percentage: 12, color: '#8BC34A' },
    { name: 'Otros',      percentage: 8,  color: '#a2a8d3' },
];

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 251.2

export default function DonutGenresCard({ genres = MOCK_GENRES }: Props) {
    // Construimos los segmentos acumulando el offset
    let accumulatedOffset = 0;
    const segments = genres.map((genre) => {
        const dash = (genre.percentage / 100) * CIRCUMFERENCE;
        const gap  = CIRCUMFERENCE - dash;
        const offset = accumulatedOffset;
        accumulatedOffset += dash;
        return { ...genre, dash, gap, offset };
    });

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top Géneros</Text>

            {/* Donut */}
            <View style={styles.donutWrapper}>
                <Svg width={130} height={130} viewBox="0 0 100 100">
                    {/* Círculo de fondo */}
                    <Circle
                        cx="50" cy="50" r={RADIUS}
                        fill="transparent"
                        stroke="#263238"
                        strokeWidth="18"
                    />
                    {/* Segmentos de color */}
                    {segments.map((seg, i) => (
                        <Circle
                            key={i}
                            cx="50" cy="50" r={RADIUS}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="18"
                            strokeDasharray={`${seg.dash} ${seg.gap}`}
                            strokeDashoffset={-seg.offset}
                            transform="rotate(-90 50 50)"
                        />
                    ))}
                </Svg>
            </View>

            {/* Leyenda */}
            <View style={styles.legend}>
                {genres.map((genre, i) => (
                    <View key={i} style={styles.legendItem}>
                        <View style={[styles.dot, { backgroundColor: genre.color }]} />
                        <Text style={styles.legendText}>
                            {genre.name}
                        </Text>
                        <Text style={styles.legendPercent}>
                            {genre.percentage}%
                        </Text>
                    </View>
                ))}
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
        padding: 16,
        alignItems: 'center',
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
        alignSelf: 'flex-start',
        textShadowColor: '#5b55c0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    donutWrapper: {
        marginBottom: 16,
    },
    legend: {
        width: '100%',
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        color: '#a2a8d3',
        fontSize: 13,
        flex: 1,
    },
    legendPercent: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
});
