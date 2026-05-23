import {
    TextInput,
    Text,
    View,
} from 'react-native';

import { colors } from '@/constants/theme';
import { styles } from '../../styles/setup.styles';

interface Props {
    value: string;
    onChange: (text: string) => void;
    error?: string;
}

export default function HabitInput({
    value,
    onChange,
    error,
}: Props) {
    return (
        <View>
            <TextInput
                style={[
                    styles.textInput,
                    error && styles.textInputError,
                ]}
                placeholder="e.g. stop hunching my back when I walk..."
                placeholderTextColor={colors.textMuted}
                value={value}
                onChangeText={onChange}
                multiline
                maxLength={120}
            />

            <Text style={styles.charCount}>
                {value.length}/120
            </Text>

            {!!error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
}