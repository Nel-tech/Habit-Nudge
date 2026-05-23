import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { colors } from '@/constants/theme';
import { loadProgress, loadHabits, DayRecord } from '@/store/habitsStore';

import { styles } from '@/app/(tabs)/styles/progress.styles';
import {
  getChartData,
  calculateStats,
} from '@/utils/progressUtils';

import ProgressHeader from '@/app/(tabs)/components/progress/ProgressHeader';
import SummaryCard from '@/app/(tabs)/components/progress/SummaryCard';
import MiniStat from '@/app/(tabs)/components/progress/MiniStat';
import ProgressChart from '@/app/(tabs)/components/progress/ProgressChart';
import InsightCard from '@/app/(tabs)/components/progress/InsightCard';

import {
  TrendingUp,
  CircleCheck as CheckCircle,
  Circle as XCircle,
} from 'lucide-react-native';

export default function ProgressScreen() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const progress = await loadProgress();
    setRecords(progress);

    await loadHabits();
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

  const chartData = getChartData(records);

  const {
    weekWins,
    weekMisses,
    weekTotal,
    winRate,
  } = calculateStats(chartData);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <ProgressHeader />

        <SummaryCard
          weekWins={weekWins}
          weekMisses={weekMisses}
        />

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

        <ProgressChart chartData={chartData} />

        <InsightCard
          weekTotal={weekTotal}
          weekWins={weekWins}
          winRate={winRate}
        />
      </ScrollView>
    </View>
  );
}