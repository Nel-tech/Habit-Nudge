import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';

import { colors } from '@/constants/theme';
import { styles } from '@/styles/progress.styles';

interface Props {
    weekWins: number;
    weekMisses: number;
}

export default function SummaryCard({
    weekWins,
    weekMisses,
}: Props) {
    return (
        <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
                <View style={styles.summaryIconWrap}>
                    <Activity size={20} color={colors.accent} />
                </View>

                <View>
                    <Text style={styles.summaryMain}>
                        You caught yourself{' '}
                        <Text style={styles.summaryHighlight}>
                            {weekWins} time
                            {weekWins !== 1 ? 's' : ''}
                        </Text>{' '}
                        this week
                    </Text>

                    <Text style={styles.summarySecondary}>
                        {weekMisses > 0
                            ? `${weekMisses} missed nudges`
                            : 'No misses recorded'}
                    </Text>
                </View>
            </View>
        </View>
    );
}