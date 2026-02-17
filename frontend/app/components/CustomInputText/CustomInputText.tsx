import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import styles from "./styles";

interface Props extends TextInputProps {
    label: string;
    placeholder: string;                                        
};

const CustomInputText = ({ label, placeholder, ...props }: Props) => {
  return (
    <div style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666"
          {...props}
        />
      </View>
    </div>
  );
};

export default CustomInputText;