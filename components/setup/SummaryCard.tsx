import { View, Text } from 'react-native';

import {
    FREQUENCIES,
    NudgeFrequency,
} from '@/store/habitsStore';

import { styles } from '../../styles/setup.styles';

interface Props {
    habitText: string;
    frequency: NudgeFrequency;
    startTime: string;
}

export default function SummaryCard({
    habitText,
    frequency,
    startTime,
}: Props) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
                Summary
            </Text>

            <Text style={styles.summaryLine}>
                Habit:{' '}
                <Text style={styles.summaryValue}>
                    {habitText || '–'}
                </Text>
            </Text>

            <Text style={styles.summaryLine}>
                Nudge:{' '}
                <Text style={styles.summaryValue}>
                    {
                        FREQUENCIES.find(
                            (f) => f.value === frequency
                        )?.label
                    }
                </Text>
            </Text>

            <Text style={styles.summaryLine}>
                Starting from:{' '}
                <Text style={styles.summaryValue}>
                    {startTime}
                </Text>
            </Text>
        </View>
    );
}