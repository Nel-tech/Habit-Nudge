import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { loadProgress, loadHabits, DayRecord } from '@/store/habitsStore';
import { TrendingUp, CircleCheck as CheckCircle, Circle as XCircle, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CHART_PADDING = spacing.lg * 2;
const BAR_AREA = width - CHART_PADDING;
const DAYS_TO_SHOW = 7;

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
}

export default function ProgressScreen() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [totalNudges, setTotalNudges] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const progress = await loadProgress();
    setRecords(progress);
    const habits = await loadHabits();
    const total = habits.reduce((sum, h) => sum + h.todayNudges, 0);
    setTotalNudges(total);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  const last7Days = getLast7Days();
  const chartData = last7Days.map((date) => {
    const record = records.find((r) => r.date === date);
    return {
      date,
      wins: record?.wins ?? 0,
      misses: record?.misses ?? 0,
      label: formatDayLabel(date),
    };
  });

  const weekWins = chartData.reduce((sum, d) => sum + d.wins, 0);
  const weekMisses = chartData.reduce((sum, d) => sum + d.misses, 0);
  const weekTotal = weekWins + weekMisses;
  const winRate = weekTotal > 0 ? Math.round((weekWins / weekTotal) * 100) : 0;

  const maxBarValue = Math.max(...chartData.map((d) => d.wins + d.misses), 1);

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
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Your week at a glance</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.summaryIconWrap}>
              <Activity size={20} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.summaryMain}>
                You caught yourself{' '}
                <Text style={styles.summaryHighlight}>{weekWins} time{weekWins !== 1 ? 's' : ''}</Text>
                {' '}this week
              </Text>
              <Text style={styles.summarySecondary}>
                {weekMisses > 0 ? `${weekMisses} missed nudge${weekMisses !== 1 ? 's' : ''}` : 'No misses recorded'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <MiniStat
            icon={<CheckCircle size={16} color={colors.success} />}
            value={weekWins.toString()}
            label="Wins"
            bgColor={colors.successSoft}
          />
          <MiniStat
            icon={<XCircle size={16} color={colors.error} />}
            value={weekMisses.toString()}
            label="Misses"
            bgColor={colors.error + '15'}
          />
          <MiniStat
            icon={<TrendingUp size={16} color={colors.accent} />}
            value={`${winRate}%`}
            label="Win rate"
            bgColor={colors.accentSoft}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Wins vs Misses — Last 7 Days</Text>

          <View style={styles.chart}>
            {chartData.map((day, idx) => {
              const dayTotal = day.wins + day.misses;
              const barHeight = Math.max((dayTotal / maxBarValue) * 140, dayTotal > 0 ? 8 : 0);
              const winsHeight = dayTotal > 0 ? (day.wins / dayTotal) * barHeight : 0;
              const missesHeight = barHeight - winsHeight;

              return (
                <View key={day.date} style={styles.barGroup}>
                  <View style={styles.barContainer}>
                    {dayTotal === 0 ? (
                      <View style={styles.emptyBar} />
                    ) : (
                      <View style={[styles.barStack, { height: barHeight }]}>
                        {missesHeight > 0 && (
                          <View
                            style={[styles.barSegment, styles.barMiss, { height: missesHeight }]}
                          />
                        )}
                        {winsHeight > 0 && (
                          <View
                            style={[styles.barSegment, styles.barWin, { height: winsHeight }]}
                          />
                        )}
                      </View>
                    )}
                  </View>
                  <Text style={styles.barLabel}>{day.label}</Text>
                  {dayTotal > 0 && <Text style={styles.barCount}>{dayTotal}</Text>}
                </View>
              );
            })}
          </View>

          <View style={styles.chartLegend}>
            <LegendItem color={colors.success} label="Caught" />
            <LegendItem color={colors.error} label="Missed" />
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Weekly insight</Text>
          <Text style={styles.insightText}>
            {weekTotal === 0
              ? 'No nudges recorded yet this week. Your habits are being tracked.'
              : weekWins === 0
              ? "You haven't caught any habits yet. Stay aware — it gets easier."
              : winRate >= 80
              ? `Excellent! You have an ${winRate}% win rate. You're building real awareness.`
              : winRate >= 50
              ? `Solid progress with a ${winRate}% win rate. Keep showing up each day.`
              : `You caught ${weekWins} out of ${weekTotal} nudges. Small wins add up — stay consistent.`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function MiniStat({
  icon,
  value,
  label,
  bgColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.miniStat, { backgroundColor: bgColor }]}>
      {icon}
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
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
    gap: spacing.lg,
  },
  header: {
    gap: 6,
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  summaryMain: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  summaryHighlight: {
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  summarySecondary: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  miniStat: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  miniStatValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  miniStatLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
  },
  chartTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingTop: 16,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barStack: {
    width: 24,
    borderRadius: radius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barSegment: {
    width: '100%',
  },
  barWin: {
    backgroundColor: colors.success,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barMiss: {
    backgroundColor: colors.error + '80',
  },
  emptyBar: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  barLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  barCount: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  insightCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent + '30',
    gap: spacing.sm,
  },
  insightTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  insightText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 23,
  },
});
