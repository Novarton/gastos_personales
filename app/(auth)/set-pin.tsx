import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';;
import { useRouter } from 'expo-router';

export default function EstablecerPinScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const guardarPin = async () => {
  if (pin.length < 4) {
    Alert.alert('El PIN debe tener al menos 4 dígitos');
    return;
  }

  if (pin !== confirmPin) {
    Alert.alert('Los PIN no coinciden');
    return;
  }

  setLoading(true);
  const existingPin = await SecureStore.getItemAsync('clave_pin'); // Verificamos si ya existe un PIN guardado

  if (existingPin) {
    Alert.alert('Ya existe un PIN guardado. Por favor, elimínalo antes de establecer uno nuevo.');
    setLoading(false);
    return;
  }

  await SecureStore.setItemAsync('clave_pin', pin); // Guardamos el PIN en SecureStore

  Alert.alert('PIN guardado correctamente');
  router.replace('/');
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Establecer un PIN</Text>

      <TextInput
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        placeholder="Nuevo PIN"
        value={pin}
        onChangeText={setPin}
      />

      <TextInput
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        placeholder="Confirmar PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
      />

      <Button title={loading ? 'Guardando...' : 'Guardar PIN'} onPress={guardarPin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
});
