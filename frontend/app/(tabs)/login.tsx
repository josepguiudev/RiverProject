import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const IP = '10.0.2.2:8080'; // emulador

  const login = () => {
    fetch('http://' + IP + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Credenciales incorrectas');
        }
        return res.json();
      })
      .then(user => {
        Alert.alert('Login correcto', 'Bienvenido ' + user.name);
      })
      .catch(err => Alert.alert('Error', err.message));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <Button title="Login" onPress={login} />
    </View>
  );
}