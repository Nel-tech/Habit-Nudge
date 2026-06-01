import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { setupNotificationResponseHandler } from '@/hooks/useNotification';
import { loadHabits } from '@/store/habitsStore';
import { cancelAllNudges, scheduleNudges } from '@/hooks/useNotification';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
  async function rescheduleNudges() {
    const all = await loadHabits();
    const active = all.filter((h) => !h.archived);
    
    if (active.length === 0) return;
    
    // Cancel old schedules
    await cancelAllNudges();
    
    // Reschedule with current code values
    for (const habit of active) {
      await scheduleNudges(habit.id, habit.text, habit.frequency);
    }
  }
  
  rescheduleNudges();
}, []);

 

  useEffect(() => {
    const subscription = setupNotificationResponseHandler();
    return () => subscription.remove();
  }, []);


  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" /> 
        <Stack.Screen name="index" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
      </SafeAreaProvider>
    </>
  );
}