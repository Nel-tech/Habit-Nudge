import {
    View,
    Text,
} from 'react-native';

import { styles } from '@/styles/past.styles';

interface Props {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export default function StatItem({
    icon,
    label,
    value,
}: Props) {
    return (
        <View style={styles.statItem}>
            <View style={styles.statItemHeader}>
                {icon}

                <Text style={styles.statLabel}>
                    {label}
                </Text>
            </View>

            <Text style={styles.statValue}>
                {value}
            </Text>
        </View>
    );
}