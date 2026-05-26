import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
} from 'react-native-reanimated';

import { styles } from '@/styles/splash.styles';

interface Props {
    stickX: any;
    stickOpacity: any;
    legKickAngle: any;
}

export default function StickFigure({
    stickX,
    stickOpacity,
    legKickAngle,
}: Props) {
    const stickStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: stickX.value }],
        opacity: stickOpacity.value,
    }));

    const legStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${legKickAngle.value}deg` },
        ],
    }));

    return (
        <Animated.View
            style={[styles.stickFigure, stickStyle]}
        >
            <View style={styles.head} />

            <View style={styles.body} />

            <View
                style={[styles.arm, styles.armLeft]}
            />

            <View
                style={[styles.arm, styles.armRight]}
            />

            <View
                style={[styles.leg, styles.legLeft]}
            />

            <Animated.View
                style={[
                    styles.leg,
                    styles.legRight,
                    legStyle,
                ]}
            />
        </Animated.View>
    );
}