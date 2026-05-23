import {
    View,
    Text,
} from 'react-native';

import {
    Archive,
    Flame,
    Calendar,
    CircleCheck as CheckCircle,
} from 'lucide-react-native';

import { Habit } from '@/store/habitsStore';

import { colors } from '@/constants/theme';

import StatItem from './StatItem';

import { styles } from '@/styles/past.styles';

export default function ArchivedHabitCard({
    habit,
}: {
    habit: Habit;
}) {
    const startDate = new Date(
        habit.createdAt
    );

    const endDate = habit.archivedAt
        ? new Date(habit.archivedAt)
        : new Date();

    const daysActive = Math.max(
        1,
        Math.round(
            (endDate.getTime() -
                startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
    );

    const formattedStart =
        startDate.toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        );

    const formattedEnd =
        endDate.toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }
        );

    const triggerLabels: Record<
        string,
        string
    > = {
        outside: 'Going outside',
        sitting: 'Sitting too long',
        both: 'Both triggers',
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                    <Text style={styles.cardHabitText}>
                        {habit.text}
                    </Text>

                    <View style={styles.triggerBadge}>
                        <Text
                            style={
                                styles.triggerBadgeText
                            }
                        >
                            {
                                triggerLabels[
                                habit.trigger
                                ]
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.streakBlock}>
                    <Flame
                        size={16}
                        color={colors.warning}
                    />

                    <Text style={styles.streakNumber}>
                        {habit.streak}
                    </Text>

                    <Text style={styles.streakUnit}>
                        streak
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardStats}>
                <StatItem
                    icon={
                        <Calendar
                            size={12}
                            color={colors.textMuted}
                        />
                    }
                    label="Started"
                    value={formattedStart}
                />

                <StatItem
                    icon={
                        <CheckCircle
                            size={12}
                            color={colors.textMuted}
                        />
                    }
                    label="Archived"
                    value={formattedEnd}
                />

                <StatItem
                    icon={
                        <Archive
                            size={12}
                            color={colors.textMuted}
                        />
                    }
                    label="Days active"
                    value={`${daysActive}d`}
                />
            </View>
        </View>
    );
}