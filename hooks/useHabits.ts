import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  Habit,
  loadHabits,
  saveHabits,
} from '@/store/habitsStore';

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
    }, [fetchHabits])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchHabits();
    setRefreshing(false);
  }

  async function archiveHabit(id: string) {
    const all = await loadHabits();

    const updated = all.map((h) =>
      h.id === id
        ? {
            ...h,
            archived: true,
            archivedAt:
              new Date().toISOString(),
          }
        : h
    );

    await saveHabits(updated);

    setHabits(
      updated.filter((h) => !h.archived)
    );
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