import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { styles } from '@/styles/home.styles';

export default function EmptyState({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
                No active habit
            </Text>

            <TouchableOpacity
                style={styles.emptyBtn}
                onPress={onAdd}
            >
                <LinearGradient
                    colors={['#2563EB', '#1D4ED8']}
                    style={styles.emptyBtnGradient}
                >
                    <Text style={styles.emptyBtnText}>
                        Add your habit
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}