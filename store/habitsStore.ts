import AsyncStorage from '@react-native-async-storage/async-storage';

export type NudgeTrigger = 'outside' | 'sitting' | 'both';
export type NudgeFrequency = '30min' | '1hour' | '2hours';

export interface Habit {
  id: string;
  text: string;
  trigger: NudgeTrigger;
  frequency: NudgeFrequency;
  outingTime: string;
  createdAt: string;
  streak: number;
  todayNudges: number;
  lastNudgeDate: string;
  archived: boolean;
  archivedAt?: string;
}

export interface DayRecord {
  date: string;
  wins: number;
  misses: number;
}

const HABITS_KEY = 'habits_v1';
const PROGRESS_KEY = 'progress_v1';

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export async function loadProgress(): Promise<DayRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveProgress(records: DayRecord[]): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(records));
}

export async function recordNudge(habitId: string, caught: boolean): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const habits = await loadHabits();
  const idx = habits.findIndex((h) => h.id === habitId);
  if (idx === -1) return;

  const habit = habits[idx];
  if (habit.lastNudgeDate !== today) {
    habit.todayNudges = 0;
    habit.lastNudgeDate = today;
  }
  if (caught) {
    habit.todayNudges += 1;
    habit.streak += 1;
  }
  habits[idx] = habit;
  await saveHabits(habits);

  const progress = await loadProgress();
  const dayIdx = progress.findIndex((d) => d.date === today);
  if (dayIdx === -1) {
    progress.push({ date: today, wins: caught ? 1 : 0, misses: caught ? 0 : 1 });
  } else {
    if (caught) progress[dayIdx].wins += 1;
    else progress[dayIdx].misses += 1;
  }
  await saveProgress(progress);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
