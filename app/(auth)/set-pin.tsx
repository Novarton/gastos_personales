import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAX_PIN_LENGTH = 8; // Puedes ajustar este valor

export default function SetPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const guardarPin = async () => {
    if (!pin) {
      setError('Ingresa un PIN para continuar.');
      return;
    }
    setLoading(true);
    await SecureStore.setItemAsync('clave_pin', pin);
    setLoading(false);
    setError('');
    Alert.alert('PIN guardado', 'Tu PIN ha sido configurado.', [
      {
        text: 'OK',
        onPress: () => router.replace('/(auth)'),
      },
    ]);
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[...Array(pin.length)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: 'white', borderColor: 'white' },
          ]}
        />
      ))}
    </View>
  );

  const handlePress = (value: string) => {
    if (!loading && pin.length < MAX_PIN_LENGTH) setPin(pin + value);
    if (error) setError('');
  };

  const handleDelete = () => {
    if (!loading) setPin(pin.slice(0, -1));
    if (error) setError('');
  };

  const renderKey = (value: string, onPress: () => void, keyProp: string) => (
    <TouchableOpacity
      key={keyProp}
      onPress={onPress}
      style={styles.key}
      disabled={loading}
      accessibilityLabel={value === '←' ? 'Borrar' : value}
      accessible
    >
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#18181f', '#24243e', '#bb3536']} style={styles.container}>
      <Text style={styles.title}>Configura tu PIN</Text>
      {renderDots()}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.keyboard}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '←'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, index) => {
              const uniqueKey = `${rowIndex}-${index}-${key}`;
              if (key === '') return <View key={uniqueKey} style={styles.key} />;
              if (key === '←') return renderKey('←', handleDelete, uniqueKey);
              return renderKey(key, () => handlePress(key), uniqueKey);
            })}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.enterButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={guardarPin}
        disabled={loading || pin.length === 0}
        accessibilityLabel="Guardar"
        accessible
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.enterButtonText}>Guardar PIN</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
    minHeight: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    marginHorizontal: 2,
  },
  errorText: {
    color: '#ffb3b3',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    minHeight: 20,
  },
  keyboard: {
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  key: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 24,
    color: 'white',
  },
  enterButton: {
    backgroundColor: '#bb3536',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  enterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
