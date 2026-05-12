import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import strings from '../../../assets/supportFiles/strings.json';
import { colors } from '@/app/screens/stylesGlobal';

interface MenuButtonProps {
    onPress: () => void;
}

export default function MenuButton({ onPress }: MenuButtonProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.text}>{strings.menu}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 40,
        left: 20,
        zIndex: 9999,
    },
    button: {
        backgroundColor: colors.surface,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        ...Platform.select({
            web: { cursor: 'pointer' }
        })
    },
    text: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    }
});
