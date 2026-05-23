import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';

import Header from './components/Header';
import Section from './components/Section';
import HabitInput from './components/HabitInput';
import FrequencySelector from './components/FrequencySelector';
import TimeSelector from './components/TimeSelector';
import SummaryCard from './components/SummaryCard';

import { useSetupHabit } from './hooks/useSetupHabit';
import { styles } from './style';

export default function SetupScreen() {
    const router = useRouter();

    const {
        habitText,
        setHabitText,
        frequency,
        setFrequency,
        startTime,
        setStartTime,
        error,
        loading,
        handleStart,
    } = useSetupHabit(router);

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Header />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Section label="What habit do you want to correct?">
                    <HabitInput
                        value={habitText}
                        onChange={setHabitText}
                        error={error}
                    />
                </Section>

                <Section label="How often should we nudge you?">
                    <FrequencySelector
                        value={frequency}
                        onChange={setFrequency}
                    />
                </Section>

                <Section label="When should we start nudging you?">
                    <TimeSelector
                        value={startTime}
                        onChange={setStartTime}
                    />
                </Section>

                <SummaryCard
                    habitText={habitText}
                    frequency={frequency}
                    startTime={startTime}
                />

                <TouchableOpacity
                    style={[styles.ctaButton, loading && { opacity: 0.7 }]}
                    onPress={handleStart}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={['#2563EB', '#1D4ED8']}
                        style={styles.ctaGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.ctaText}>
                                Start Correcting
                            </Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}