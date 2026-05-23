import { View, Text } from 'react-native';
import { styles } from '@/app/(tabs)/styles/progress.styles';

interface Props {
    weekTotal: number;
    weekWins: number;
    winRate: number;
}

export default function InsightCard({
    weekTotal,
    weekWins,
    winRate,
}: Props) {
    function getInsight() {
        if (weekTotal === 0) {
            return 'No nudges recorded yet this week.';
        }

        if (weekWins === 0) {
            return "You haven't caught any habits yet.";
        }

        if (winRate >= 80) {
            return `Excellent! ${winRate}% win rate.`;
        }

        if (winRate >= 50) {
            return `Solid progress with ${winRate}% win rate.`;
        }

        return 'Small wins add up.';
    }

    return (
        <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>
                Weekly insight
            </Text>

            <Text style={styles.insightText}>
                {getInsight()}
            </Text>
        </View>
    );
}