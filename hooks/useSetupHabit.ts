import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Habit,
  loadHabits,
  saveHabits,
  generateId,
  NudgeFrequency,
} from '@/store/habitsStore';

import {
  requestNotificationPermission,
  scheduleNudges,
} from '@/hooks/useNotification';

export function useSetupHabit(router: any) {
  const [habitText, setHabitText] = useState('');
  const [frequency, setFrequency] =
    useState<NudgeFrequency>('1hour');

  const [startTime, setStartTime] =
    useState('8:00 AM');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!habitText.trim()) {
      setError('Please describe your habit first.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const granted =
        await requestNotificationPermission();

      const today =
        new Date().toISOString().split('T')[0];

      const newHabit: Habit = {
        id: generateId(),
        text: habitText.trim(),
        trigger: 'both',
        frequency,
        outingTime: startTime,
        createdAt: new Date().toISOString(),
        streak: 0,
        todayNudges: 0,
        lastNudgeDate: today,
        archived: false,
      };

      const existing = await loadHabits();

      await saveHabits([...existing, newHabit]);

      await AsyncStorage.setItem(
        'onboarding_done',
        'true'
      );

      if (granted) {
        await scheduleNudges(
           newHabit.id, 
          habitText.trim(),
          frequency
          
        );
      }

      router.replace('/(tabs)');
    } catch {
      setError(
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    habitText,
    setHabitText,
    frequency,
    setFrequency,
    startTime,
    setStartTime,
    error,
    loading,
    handleStart,
  };
}