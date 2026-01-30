import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    Button, 
    Text, 
    StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../navigation/RootStackParams';
import { styles } from './styles';

export default function LoginScreen() {
    const [userName, setUserName] = useState('');
    const [surname1, setSurname1] = useState('');
    const [surname2, setSurname2] = useState('');
    const [email, setEmail] = useState('');
    const [steamUrl, setSteamUrl] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const handleLogin = () => {
    if (userName !== null && surname1 !== null && surname2 !== null && email !== null && steamUrl !== null && password !== null) {
        console.log('Logging in with:', { userName, surname1, surname2, email, steamUrl, password });
        // Aquí iría la lógica de autenticación
        navigation.navigate('Home');
    }else{
        console.log('Por favor, complete todos los campos.');
    }
}
}

