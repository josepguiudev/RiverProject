import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Genre {
    name: string;
    percentage: number;
    color: string;
}

interface ApiGenre {
    name: string;
    percentage: number;
}

interface Props {
    /** 
     * Géneros que vienen de la API (sin color).
     * Si no se pasan o están vacíos, se usan los mock.
     */
    genres?: ApiGenre[];
}

// Paleta de colores para asignar a los géneros dinámicamente
const GENRE_COLORS = ['#e43f5a', '#5b55c0', '#64B5F6', '#8BC34A', '#FFB74D', '#CE93D8', '#4DD0E1', '#FF8A65'];

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

/**
 * Convierte géneros de la API (sin color) a géneros con color asignado.
 * Solo toma los top 5 y agrupa el resto en "Otros".
 */
function mapApiGenres(apiGenres: ApiGenre[]): Genre[] {
    if (!apiGenres || apiGenres.length === 0) return MOCK_GENRES;

    // Tomamos top 5; si hay más, sumamos el resto como "Otros"
    const top5 = apiGenres.slice(0, 5);
    const rest = apiGenres.slice(5);

    const result: Genre[] = top5.map((g, i) => ({
        name: g.name,
        percentage: g.percentage,
        color: GENRE_COLORS[i % GENRE_COLORS.length],
    }));

    if (rest.length > 0) {
        const otherPercentage = rest.reduce((sum, g) => sum + g.percentage, 0);
        result.push({
            name: 'Otros',
            percentage: otherPercentage,
            color: '#a2a8d3',
        });
    }

    return result;
}

export default function DonutGenresCard({ genres }: Props) {
    // Si vienen datos reales de la API, los mapeamos; si no, mock.
    const displayGenres = genres && genres.length > 0
        ? mapApiGenres(genres)
        : MOCK_GENRES;

    // Construimos los segmentos acumulando el offset
    let accumulatedOffset = 0;
    const segments = displayGenres.map((genre) => {
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
                {displayGenres.map((genre, i) => (
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
