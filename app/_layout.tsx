// app/_layout.tsx
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const verificarPin = async () => {
      try {
        const pin = await SecureStore.getItemAsync('clave_pin');
        if (!pin && pathname !== '/set-pin') {
          router.replace('/set-pin');
        }
      } catch (error) {
        // Puedes mostrar un mensaje, loguear el error o manejarlo según tu necesidad
        console.error('Error al verificar el PIN:', error);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    verificarPin();
    return () => { isMounted = false; };
  }, [pathname, router]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack />;
}
