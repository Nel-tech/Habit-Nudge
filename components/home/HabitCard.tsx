import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Habit } from '@/store/habitsStore';
import { styles } from '@/styles/home.styles';

interface Props {
    habit: Habit;
    onCaught: () => void;
    onMissed: () => void;
    onArchive: () => void;
}

export default function HabitCard({
    habit,
    onCaught,
    onMissed,
    onArchive,
}: Props) {
    return (
        <View style={styles.habitCard}>
            <Text style={styles.habitText}>
                "{habit.text}"
            </Text>

            <TouchableOpacity
                style={styles.caughtBtn}
                onPress={onCaught}
            >
                <Text style={styles.caughtBtnText}>
                    ✓ Fixed it
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onArchive}
            >
                <Text style={styles.archiveText}>
                    Mark as done
                </Text>
            </TouchableOpacity>
        </View>
    );
}