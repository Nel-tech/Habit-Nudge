import Animated, {
    useAnimatedStyle,
} from 'react-native-reanimated';

import { styles } from '@/styles/splash.styles';

interface Props {
    textOpacity: any;
    textY: any;
}

export default function BrandText({
    textOpacity,
    textY,
}: Props) {
    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textY.value }],
    }));

    return (
        <Animated.View
            style={[styles.textWrapper, textStyle]}
        >
            <Animated.Text style={styles.appName}>
                Habit Nudge
            </Animated.Text>

            <Animated.Text style={styles.tagline}>
                Fix that habit. No effort required.
            </Animated.Text>
        </Animated.View>
    );
}