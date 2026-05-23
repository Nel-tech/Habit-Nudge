import { View, Text } from 'react-native';
import { styles } from '@/app/(tabs)/styles/progress.styles';

export default function ProgressHeader() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>
                Your week at a glance
            </Text>
        </View>
    );
}