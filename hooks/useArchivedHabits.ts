import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  Habit,
  loadHabits,
} from '@/store/habitsStore';

export function useArchivedHabits() {
  const [archived, setArchived] =
    useState<Habit[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const fetchArchived = useCallback(async () => {
    const all = await loadHabits();

    const archivedHabits = all
      .filter((h) => h.archived)
      .sort((a, b) => {
        const dateA =
          a.archivedAt ?? a.createdAt;

        const dateB =
          b.archivedAt ?? b.createdAt;

        return (
          new Date(dateB).getTime() -
          new Date(dateA).getTime()
        );
      });

    setArchived(archivedHabits);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchArchived();
    }, [fetchArchived])
  );

  async function onRefresh() {
    setRefreshing(true);

    await fetchArchived();

    setRefreshing(false);
  }

  return {
    archived,
    refreshing,
    onRefresh,
  };
}