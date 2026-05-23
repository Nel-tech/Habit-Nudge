import { DayRecord } from '@/store/habitsStore';

export function getLast7Days(): string[] {
  const days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  return days;
}

export function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');

  return d
    .toLocaleDateString('en-US', { weekday: 'short' })
    .slice(0, 3);
}

export function getChartData(records: DayRecord[]) {
  return getLast7Days().map((date) => {
    const record = records.find((r) => r.date === date);

    return {
      date,
      wins: record?.wins ?? 0,
      misses: record?.misses ?? 0,
      label: formatDayLabel(date),
    };
  });
}

export function calculateStats(chartData: any[]) {
  const weekWins = chartData.reduce(
    (sum, d) => sum + d.wins,
    0
  );

  const weekMisses = chartData.reduce(
    (sum, d) => sum + d.misses,
    0
  );

  const weekTotal = weekWins + weekMisses;

  const winRate =
    weekTotal > 0
      ? Math.round((weekWins / weekTotal) * 100)
      : 0;

  return {
    weekWins,
    weekMisses,
    weekTotal,
    winRate,
  };
}