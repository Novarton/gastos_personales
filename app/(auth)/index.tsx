import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAX_PIN_LENGTH = 8; // Puedes ajustar este valor

export default function SetPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const validarPin = async () => {
    setLoading(true);
    setError('');
    const pinGuardado = await SecureStore.getItemAsync('clave_pin');
    if (pinGuardado === pin) {
      router.replace('/(main)');
    } else {
      setError('PIN incorrecto. Intenta de nuevo.');
      setPin('');
      shake(); // Llama a la animación de shake
    }
    setLoading(false);
  };

  const renderDots = () => (
    <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}>
      {[...Array(pin.length)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: 'white', borderColor: 'white' },
          ]}
        />
      ))}
    </Animated.View>
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
      <Text style={styles.title}>Ingresa tu PIN</Text>
      {renderDots()}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.keyboard}>
        {
          [
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
        style={[
          styles.enterButton,
          { opacity: loading || pin.length === 0 ? 0.7 : 1 },
        ]}
        onPress={validarPin}
        disabled={loading || pin.length === 0}
        accessibilityLabel="Entrar"
        accessible
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.enterButtonText}>Entrar</Text>
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