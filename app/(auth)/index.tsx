import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const PIN_LENGTH = 4;
const CORRECT_PIN = '1234';

export default function Index() {
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handlePress = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  React.useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === CORRECT_PIN) {
        router.replace('/(tabs)');
      } else {
        Vibration.vibrate(200);
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin]);

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[...Array(PIN_LENGTH)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < pin.length ? 'white' : 'transparent', borderColor: 'white' },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKey = (value: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.key}>
      <Text style={styles.keyText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#18181f', '#24243e', '#bb3536']} style={styles.container}> 
      <Text style={styles.title}>Contraseña</Text>
      {renderDots()}
      <View style={styles.keyboard}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', '←'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, index) => {
              if (key === '') return <View key={index} style={styles.key} />;
              if (key === '←') return renderKey('←', handleDelete);
              return renderKey(key, () => handlePress(key));
            })}
          </View>
        ))}
      </View>
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
    marginBottom: 60,
    gap: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  keyboard: {
    width: '100%',
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
});
