import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { styles } from '../../styles/setup.styles';

export default function Header() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 60) }]}>
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