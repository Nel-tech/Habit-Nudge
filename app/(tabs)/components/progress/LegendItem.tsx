import { View, Text } from 'react-native';
import { styles } from '@/app/(tabs)/styles/progress.styles';

interface Props {
    color: string;
    label: string;
}

export default function LegendItem({
    color,
    label,
}: Props) {
    return (
        <View style={styles.legendItem}>
            <View
                style={[
                    styles.legendDot,
                    { backgroundColor: color },
                ]}
            />

            <Text style={styles.legendLabel}>
                {label}
            </Text>
        </View>
    );
}