import { View, Text } from 'react-native';
import { styles } from '@/styles/progress.styles';
import LegendItem from './LegendItem';
import { colors } from '@/constants/theme';

interface Props {
    chartData: any[];
}

export default function ProgressChart({
    chartData,
}: Props) {
    const maxBarValue = Math.max(
        ...chartData.map((d) => d.wins + d.misses),
        1
    );

    return (
        <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
                Wins vs Misses — Last 7 Days
            </Text>

            <View style={styles.chart}>
                {chartData.map((day) => {
                    const total = day.wins + day.misses;

                    const barHeight = Math.max(
                        (total / maxBarValue) * 140,
                        total > 0 ? 8 : 0
                    );

                    const winsHeight =
                        total > 0
                            ? (day.wins / total) * barHeight
                            : 0;

                    const missesHeight =
                        barHeight - winsHeight;

                    return (
                        <View
                            key={day.date}
                            style={styles.barGroup}
                        >
                            <View style={styles.barContainer}>
                                {total === 0 ? (
                                    <View style={styles.emptyBar} />
                                ) : (
                                    <View
                                        style={[
                                            styles.barStack,
                                            { height: barHeight },
                                        ]}
                                    >
                                        {missesHeight > 0 && (
                                            <View
                                                style={[
                                                    styles.barSegment,
                                                    styles.barMiss,
                                                    { height: missesHeight },
                                                ]}
                                            />
                                        )}

                                        {winsHeight > 0 && (
                                            <View
                                                style={[
                                                    styles.barSegment,
                                                    styles.barWin,
                                                    { height: winsHeight },
                                                ]}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>

                            <Text style={styles.barLabel}>
                                {day.label}
                            </Text>

                            {total > 0 && (
                                <Text style={styles.barCount}>
                                    {total}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>

            <View style={styles.chartLegend}>
                <LegendItem
                    color={colors.success}
                    label="Caught"
                />

                <LegendItem
                    color={colors.error}
                    label="Missed"
                />
            </View>
        </View>
    );
}