import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
};

const CustomButton = ({ title, onPress, disabled = false, loading = false}: Props) => {
    return (
        <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
            {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.text}>{title}</Text>
        )}
        </TouchableOpacity>
    )
}

export default CustomButton;