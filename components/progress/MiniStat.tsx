import { View, Text } from 'react-native';
import { styles } from '@/styles/progress.styles';

interface Props {
    icon: React.ReactNode;
    value: string;
    label: string;
    bgColor: string;
}

export default function MiniStat({
    icon,
    value,
    label,
    bgColor,
}: Props) {
    return (
        <View
            style={[
                styles.miniStat,
                { backgroundColor: bgColor },
            ]}
        >
            {icon}

            <Text style={styles.miniStatValue}>
                {value}
            </Text>

            <Text style={styles.miniStatLabel}>
                {label}
            </Text>
        </View>
    );
}