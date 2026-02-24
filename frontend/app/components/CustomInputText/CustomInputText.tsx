import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import styles from "./styles";

interface Props extends TextInputProps {
    label?: string;
    placeholder: string;  
    isAdmin?: boolean;  
    onChangeText?: (text: string) => void;                                    
};

const CustomInputText = ({ label, placeholder, isAdmin=false, ...props }: Props) => {
  return (
    <div style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { fontSize: isAdmin ? 12 : 16 }, { paddingVertical: isAdmin ? 8 : 12 }]}
          placeholder={placeholder}
          placeholderTextColor="#666"
          {...props}
        />
      </View>
    </div>
  );
};

export default CustomInputText;