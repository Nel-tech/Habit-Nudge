import {
    View,
    Text,
} from 'react-native';

import { Archive } from 'lucide-react-native';

import { colors } from '@/constants/theme';

import { styles } from '@/styles/past.styles';

export default function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
                <Archive
                    size={28}
                    color={colors.textMuted}
                />
            </View>

            <Text style={styles.emptyTitle}>
                No completed habits yet.
            </Text>

            <Text style={styles.emptySubtext}>
                Keep going.
            </Text>

            <Text style={styles.emptyHint}>
                Archive a habit from the Home
                screen once you've conquered it.
            </Text>
        </View>
    );
}