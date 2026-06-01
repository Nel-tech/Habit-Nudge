import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { cancelAllNudges, scheduleNudges } from './useNotification';
import {
  Habit,
  loadHabits,
  saveHabits,
} from '@/store/habitsStore';
import { appEvents, EVENTS } from '@/utils/eventEmitter';

export function useHabits() {
  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchHabits = useCallback(async () => {
    const all = await loadHabits();

    setHabits(
      all.filter((h) => !h.archived)
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();

      appEvents.on(EVENTS.NUDGE_RECORDED, fetchHabits);

      return () => {
        appEvents.off(EVENTS.NUDGE_RECORDED, fetchHabits);
      };
    }, [fetchHabits])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  }

async function archiveHabit(id: string) {
  // Stop all notifications
  await cancelAllNudges();

  const all = await loadHabits();
  const updated = all.map((h) =>
    h.id === id
      ? { ...h, archived: true, archivedAt: new Date().toISOString() }
      : h
  );

  await saveHabits(updated);

  const remaining = updated.filter((h) => !h.archived);
  
  // Restart nudges for remaining active habits
  for (const habit of remaining) {
    await scheduleNudges(habit.id, habit.text, habit.frequency);
  }

  setHabits(remaining);
}

  async function handleCheckin(
    habitId: string,
    caught: boolean
  ) {
    const today =
      new Date().toISOString().split('T')[0];

    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;

      const reset =
        h.lastNudgeDate !== today
          ? {
              ...h,
              todayNudges: 0,
              lastNudgeDate: today,
            }
          : h;

      return {
        ...reset,
        todayNudges: caught
          ? reset.todayNudges + 1
          : reset.todayNudges,
      };
    });

    setHabits(updated);

    await saveHabits(updated);
  }

  return {
    habits,
    refreshing,
    onRefresh,
    archiveHabit,
    handleCheckin,
  };
}