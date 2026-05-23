import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { styles } from '@/styles/home.styles';

export default function HomeHeader() {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>
                    Habit Nudge
                </Text>

                <Text style={styles.sub}>
                    Stay aware. Correct yourself.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                    router.push('/setup')
                }
            >
                <Plus
                    size={20}
                    color={colors.white}
                />
            </TouchableOpacity>
        </View>
    );
}