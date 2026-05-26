import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { Habit } from '@/store/habitsStore';
import { styles } from '@/styles/home.styles';

interface Props {
    habit: Habit;
    onArchive: () => void;
}

export default function HabitCard({ habit, onArchive }: Props) {

    function confirmArchive() {
        Alert.alert(
            "Mark as done?",
            `This will stop all nudges for:\n\n"${habit.text}"\n\nOnly do this if you feel you've genuinely corrected this habit.`,
            [
                {
                    text: 'Not yet',
                    style: 'cancel',
                },
                {
                    text: "Yes, I'm done",
                    style: 'destructive',
                    onPress: onArchive,
                },
            ]
        );
    }

    const frequencyLabel: Record<string, string> = {
        '30min': 'every 30 min',
        '1hour': 'every hour',
        '2hours': 'every 2 hours',
    };

    return (
        <View style={styles.habitCard}>

            <Text style={styles.habitText}>"{habit.text}"</Text>

            <Text style={styles.habitMeta}>
                Nudging {frequencyLabel[habit.frequency]} · starts {habit.outingTime}
            </Text>

            <TouchableOpacity
                style={styles.doneBtn}
                onPress={confirmArchive}
                activeOpacity={0.8}
            >
                <Text style={styles.doneBtnText}>Mark as done</Text>
            </TouchableOpacity>

        </View>
    );
}