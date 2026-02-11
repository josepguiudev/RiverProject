import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import CustomButton from "@/app/components/CustomButton/CustomButton";
import CustomInputText from "@/app/components/CustomInputText/CustomInputText";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
        alert("Login incorrecto");
        return;
        }

        const data = await res.json();
        await AsyncStorage.setItem("token", data.token);
        navigation.replace("Home");
    };
    return (
    <View>
      <CustomInputText label="Dirección de correo electrónico" placeholder="pruebapolitecnics@gmail.com" onChangeText={setEmail}/>
      <CustomInputText label="Contraseña" placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      <CustomButton title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text>No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

