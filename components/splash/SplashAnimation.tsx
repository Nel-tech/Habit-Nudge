import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import Animated, {
    useAnimatedStyle,
} from 'react-native-reanimated';

import { styles } from '@/styles/splash.styles';

import BrandText from './BrandText';

import { useSplashAnimation } from '@/hooks/useSplashAnimation';

export default function SplashAnimation() {
    const router = useRouter();

    async function navigate() {
        const done = await AsyncStorage.getItem(
            'onboarding_done'
        );

        if (done === 'true') {
            router.replace('/(tabs)');
        } else {
            router.replace('/welcome');
        }
    }

    const {
        nScale,
        nOpacity,
        textOpacity,
        textY,
        screenOpacity,
    } = useSplashAnimation({
        onFinish: navigate,
    });

    const nStyle = useAnimatedStyle(() => ({
        transform: [{ scale: nScale.value }],
        opacity: nOpacity.value,
    }));

    const screenStyle = useAnimatedStyle(() => ({
        opacity: screenOpacity.value,
    }));

    return (
        <Animated.View
            style={[styles.container, screenStyle]}
        >
            <View style={styles.stage}>
                <Animated.View
                    style={[styles.nWrapper, nStyle]}
                >
                    <Animated.Text style={styles.hText}>
                        H
                    </Animated.Text>
                    <Animated.Text style={styles.nText}>
                        N
                    </Animated.Text>
                </Animated.View>
            </View>

            <BrandText
                textOpacity={textOpacity}
                textY={textY}
            />
        </Animated.View>
    );
}