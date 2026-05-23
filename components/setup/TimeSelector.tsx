import {
    ScrollView,
    TouchableOpacity,
    Text,
} from 'react-native';

import { TIMES } from '@/store/habitsStore';
import { styles } from '../../styles/setup.styles';

interface Props {
    value: string;
    onChange: (time: string) => void;
}

export default function TimeSelector({
    value,
    onChange,
}: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeRow}
        >
            {TIMES.map((t) => (
                <TouchableOpacity
                    key={t}
                    style={[
                        styles.timeChip,
                        value === t &&
                        styles.timeChipActive,
                    ]}
                    onPress={() => onChange(t)}
                >
                    <Text
                        style={[
                            styles.timeChipText,
                            value === t &&
                            styles.timeChipTextActive,
                        ]}
                    >
                        {t}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}