import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { loadHabits, Habit } from '@/store/habitsStore';
import { Archive, Flame, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function PastHabitsScreen() {
  const [archived, setArchived] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArchived = useCallback(async () => {
    const all = await loadHabits();
    const archivedHabits = all
      .filter((h) => h.archived)
      .sort((a, b) => {
        const dateA = a.archivedAt ?? a.createdAt;
        const dateB = b.archivedAt ?? b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Past Habits</Text>
          <Text style={styles.subtitle}>
            {archived.length > 0
              ? `${archived.length} completed habit${archived.length !== 1 ? 's' : ''}`
              : 'Your history lives here'}
          </Text>
        </View>

        {archived.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {archived.map((habit) => (
              <ArchivedHabitCard key={habit.id} habit={habit} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ArchivedHabitCard({ habit }: { habit: Habit }) {
  const startDate = new Date(habit.createdAt);
  const endDate = habit.archivedAt ? new Date(habit.archivedAt) : new Date();
  const daysActive = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const formattedStart = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedEnd = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const triggerLabels: Record<string, string> = {
    outside: 'Going outside',
    sitting: 'Sitting too long',
    both: 'Both triggers',
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardHabitText}>{habit.text}</Text>
          <View style={styles.triggerBadge}>
            <Text style={styles.triggerBadgeText}>{triggerLabels[habit.trigger]}</Text>
          </View>
        </View>
        <View style={styles.streakBlock}>
          <Flame size={16} color={colors.warning} />
          <Text style={styles.streakNumber}>{habit.streak}</Text>
          <Text style={styles.streakUnit}>streak</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardStats}>
        <StatItem
          icon={<Calendar size={12} color={colors.textMuted} />}
          label="Started"
          value={formattedStart}
        />
        <StatItem
          icon={<CheckCircle size={12} color={colors.textMuted} />}
          label="Archived"
          value={formattedEnd}
        />
        <StatItem
          icon={<Archive size={12} color={colors.textMuted} />}
          label="Days active"
          value={`${daysActive}d`}
        />
      </View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statItemHeader}>
        {icon}
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Archive size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No completed habits yet.</Text>
      <Text style={styles.emptySubtext}>Keep going.</Text>
      <Text style={styles.emptyHint}>
        Archive a habit from the Home screen once you've conquered it.
      </Text>
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
    paddingTop: 60,
    paddingBottom: 32,
    gap: spacing.md,
  },
  header: {
    gap: 6,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  cardHabitText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  triggerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  triggerBadgeText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  streakBlock: {
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.warning + '15',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  streakNumber: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.warning,
  },
  streakUnit: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.warning + 'AA',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    gap: 4,
  },
  statItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  emptyHint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
