import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native';

import {
    FREQUENCIES,
    NudgeFrequency,
} from '@/store/habitsStore';

import { styles } from '../style';

interface Props {
    value: NudgeFrequency;
    onChange: (value: NudgeFrequency) => void;
}

export default function FrequencySelector({
    value,
    onChange,
}: Props) {
    return (
        <View style={styles.chipRow}>
            {FREQUENCIES.map((f) => (
                <TouchableOpacity
                    key={f.value}
                    style={[
                        styles.chip,
                        value === f.value &&
                        styles.chipActive,
                    ]}
                    onPress={() => onChange(f.value)}
                >
                    <Text
                        style={[
                            styles.chipText,
                            value === f.value &&
                            styles.chipTextActive,
                        ]}
                    >
                        {f.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}