import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useBankStore } from '../store/useBankStore';
import { StatusBar } from 'expo-status-bar';
import { ROUTES } from '../constants/config';

export default function RootLayout() {
  const { isAuthenticated } = useBankStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace(ROUTES.LOGIN as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace(ROUTES.HOME as any);
    }
  }, [isAuthenticated, segments, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}