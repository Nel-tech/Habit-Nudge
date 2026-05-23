import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { styles } from '../style';

export default function Header() {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
            >
                <ArrowLeft
                    size={20}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
                New habit
            </Text>
        </View>
    );
}