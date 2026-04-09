import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import styles from "./styles";
import { isWeb } from "../../utils/device";

interface Props extends TextInputProps {
    label?: string;
    placeholder: string;  
    isAdmin?: boolean;  
    onChangeText?: (text: string) => void;                                    
};

const CustomInputText = ({ label, placeholder, isAdmin=false, ...props }: Props) => {
  if (isWeb) {
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
    </div>);
    }else {
    return (
        <View style={styles.container}>
  {label && <Text style={styles.label}>{label}</Text>}
  
  <View style={styles.inputWrapper}>
    <TextInput
      style={[
        styles.input, 
        { 
          fontSize: isAdmin ? 12 : 16, 
          paddingVertical: isAdmin ? 8 : 12 
        }
      ]}
      placeholder={placeholder}
      placeholderTextColor="#666"
      underlineColorAndroid="transparent" // 🔥 El toque mágico para Android
      {...props}
    />
  </View>
</View>
    );
    }
  
};

export default CustomInputText;