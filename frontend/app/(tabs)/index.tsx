import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type User = {
  id: number;
  name: string;
  email: string;
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const IP = '10.0.2.2:8080';

  useEffect(() => {
    fetch('http://' + IP + '/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Proyecto funcionando 🚀</Text>
      {users.map(u => (
        <Text key={u.id}>{u.name} - {u.email}</Text>
      ))}
    </View>
  );
}