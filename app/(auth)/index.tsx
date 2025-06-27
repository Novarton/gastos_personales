// app/(auth)/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function IngresoPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const validarPin = async () => {
    setLoading(true);
    const pinGuardado = await SecureStore.getItemAsync('clave_pin') // ✅ Correcto


    if (pinGuardado === pin) {
      router.replace('/(main)'); // va al layout principal (main/index.tsx)
    } else {
      Alert.alert('PIN incorrecto', 'Intenta de nuevo.');
      setPin('');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa tu PIN</Text>
      <TextInput
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="••••"
      />
      <Button title={loading ? 'Verificando...' : 'Acceder'} onPress={validarPin} disabled={loading || pin.length < 4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center'
  }
});
