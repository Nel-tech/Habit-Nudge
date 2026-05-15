import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { loadHabits, saveHabits, Habit } from '@/store/habitsStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, History, Flame, Bell, CircleCheck as CheckCircle, Circle as XCircle, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHabits = useCallback(async () => {
    const all = await loadHabits();
    setHabits(all.filter((h) => !h.archived));
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

  async function handleNudge(habitId: string, caught: boolean) {
    const today = new Date().toISOString().split('T')[0];
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const base = h.lastNudgeDate !== today ? { ...h, todayNudges: 0, lastNudgeDate: today } : h;
      return {
        ...base,
        todayNudges: caught ? base.todayNudges + 1 : base.todayNudges,
        streak: caught ? base.streak + 1 : base.streak,
      };
    });
    setHabits(updated.filter((h) => !h.archived));
    await saveHabits([
      ...updated,
    ]);
  }

  async function archiveHabit(habitId: string) {
    const all = await loadHabits();
    const updated = all.map((h) =>
      h.id === habitId ? { ...h, archived: true, archivedAt: new Date().toISOString() } : h
    );
    await saveHabits(updated);
    setHabits(updated.filter((h) => !h.archived));
  }

  const totalNudges = habits.reduce((sum, h) => sum + h.todayNudges, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Good work.</Text>
          <Text style={styles.subGreeting}>Stay mindful today.</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon={<Bell size={18} color={colors.accent} />}
            value={totalNudges.toString()}
            label="Today's nudges"
            accent={colors.accent}
          />
          <StatCard
            icon={<Flame size={18} color={colors.warning} />}
            value={bestStreak.toString()}
            label="Best streak"
            accent={colors.warning}
          />
          <StatCard
            icon={<Zap size={18} color={colors.success} />}
            value={habits.length.toString()}
            label="Active habits"
            accent={colors.success}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Habits</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/setup')}
            activeOpacity={0.8}
          >
            <Plus size={14} color={colors.accent} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {habits.length === 0 ? (
          <EmptyState onAdd={() => router.push('/setup')} />
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onCaught={() => handleNudge(habit.id, true)}
              onMissed={() => handleNudge(habit.id, false)}
              onArchive={() => archiveHabit(habit.id)}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.viewPastBtn}
          onPress={() => router.push('/(tabs)/past')}
          activeOpacity={0.8}
        >
          <History size={16} color={colors.textSecondary} />
          <Text style={styles.viewPastText}>View Past Habits</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: accent + '20' }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function HabitCard({
  habit,
  onCaught,
  onMissed,
  onArchive,
}: {
  habit: Habit;
  onCaught: () => void;
  onMissed: () => void;
  onArchive: () => void;
}) {
  const triggerLabels: Record<string, string> = {
    outside: 'Going outside',
    sitting: 'Sitting too long',
    both: 'Both triggers',
  };
  const frequencyLabels: Record<string, string> = {
    '30min': 'Every 30 min',
    '1hour': 'Every hour',
    '2hours': 'Every 2 hours',
  };

  return (
    <View style={styles.habitCard}>
      <View style={styles.habitCardHeader}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitText}>{habit.text}</Text>
          <View style={styles.habitMeta}>
            <MetaBadge label={triggerLabels[habit.trigger]} />
            <MetaBadge label={frequencyLabels[habit.frequency]} />
          </View>
        </View>
        <View style={styles.streakBadge}>
          <Flame size={14} color={colors.warning} />
          <Text style={styles.streakText}>{habit.streak}</Text>
        </View>
      </View>

      <View style={styles.habitStats}>
        <View style={styles.habitStatItem}>
          <Bell size={12} color={colors.textMuted} />
          <Text style={styles.habitStatText}>{habit.todayNudges} nudges today</Text>
        </View>
        <View style={styles.habitStatItem}>
          <Text style={styles.habitStatText}>Out at {habit.outingTime}</Text>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity style={styles.caughtBtn} onPress={onCaught} activeOpacity={0.8}>
          <CheckCircle size={16} color={colors.success} />
          <Text style={styles.caughtBtnText}>Caught it</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missedBtn} onPress={onMissed} activeOpacity={0.8}>
          <XCircle size={16} color={colors.textMuted} />
          <Text style={styles.missedBtnText}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.archiveBtn} onPress={onArchive} activeOpacity={0.8}>
          <Text style={styles.archiveBtnText}>Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MetaBadge({ label }: { label: string }) {
  return (
    <View style={styles.metaBadge}>
      <Text style={styles.metaBadgeText}>{label}</Text>
    </View>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Zap size={28} color={colors.accent} />
      </View>
      <Text style={styles.emptyTitle}>No active habits</Text>
      <Text style={styles.emptySubtext}>Add your first habit and start correcting today.</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onAdd} activeOpacity={0.85}>
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.emptyButtonText}>Add First Habit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    paddingTop: 60,
    gap: spacing.lg,
  },
  headerSection: {
    gap: 4,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  addButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.accent,
  },
  habitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  habitInfo: {
    flex: 1,
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  habitText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  habitMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaBadge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaBadgeText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warning + '20',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  streakText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.warning,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  habitStatText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  habitActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  caughtBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  caughtBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.success,
  },
  missedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  missedBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  archiveBtn: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  archiveBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  viewPastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  viewPastText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
    minWidth: 180,
  },
  emptyButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  emptyButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
