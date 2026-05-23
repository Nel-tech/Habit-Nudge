import { View, Text } from 'react-native';
import { styles } from '../style';

export default function Section({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionLabel}>
                {label}
            </Text>

            {children}
        </View>
    );
}