import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Error al registrar");
      return;
    }

    alert("Usuario creado correctamente");
    navigation.navigate("Login");
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Registrarse" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
