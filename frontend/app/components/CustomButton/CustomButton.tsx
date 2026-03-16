import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./styles";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    isAdmin?: boolean;
};

const CustomButton = ({ title, onPress, disabled = false, loading = false, isAdmin = false}: Props) => {
    return (
        <TouchableOpacity style={[styles.button, {paddingVertical: isAdmin ? 4 : 14}, {width: isAdmin ? "33%" : "50%"}, disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
            {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={[styles.text, {fontSize: isAdmin ? 10 : 16 }]}>{title}</Text>
        )}
        </TouchableOpacity>
    )
}

export default CustomButton;