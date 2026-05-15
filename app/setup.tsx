import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { NudgeTrigger, NudgeFrequency, Habit, loadHabits, saveHabits, generateId } from '@/store/habitsStore';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Zap } from 'lucide-react-native';

const TRIGGERS: { value: NudgeTrigger; label: string; desc: string }[] = [
  { value: 'outside', label: 'Going outside', desc: 'When you step out' },
  { value: 'sitting', label: 'Sitting too long', desc: 'Every interval indoors' },
  { value: 'both', label: 'Both', desc: 'Maximum coverage' },
];

const FREQUENCIES: { value: NudgeFrequency; label: string }[] = [
  { value: '30min', label: 'Every 30 min' },
  { value: '1hour', label: 'Every 1 hour' },
  { value: '2hours', label: 'Every 2 hours' },
];

const TIMES = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

export default function SetupScreen() {
  const router = useRouter();
  const [habitText, setHabitText] = useState('');
  const [trigger, setTrigger] = useState<NudgeTrigger>('both');
  const [frequency, setFrequency] = useState<NudgeFrequency>('1hour');
  const [outingTime, setOutingTime] = useState('8:00 AM');
  const [error, setError] = useState('');

  async function handleStart() {
    if (!habitText.trim()) {
      setError('Please describe your habit first.');
      return;
    }
    setError('');

    const today = new Date().toISOString().split('T')[0];
    const newHabit: Habit = {
      id: generateId(),
      text: habitText.trim(),
      trigger,
      frequency,
      outingTime,
      createdAt: new Date().toISOString(),
      streak: 0,
      todayNudges: 0,
      lastNudgeDate: today,
      archived: false,
    };

    const existing = await loadHabits();
    await saveHabits([...existing, newHabit]);
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set up your habit</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Section
          icon={<Zap size={16} color={colors.accent} />}
          label="What habit do you want to correct?"
        >
          <TextInput
            style={[styles.textInput, error ? styles.textInputError : null]}
            placeholder="e.g. slouching, biting nails, phone neck..."
            placeholderTextColor={colors.textMuted}
            value={habitText}
            onChangeText={(t) => { setHabitText(t); setError(''); }}
            multiline
            maxLength={120}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Text style={styles.charCount}>{habitText.length}/120</Text>
        </Section>

        <Section
          icon={<Clock size={16} color={colors.accent} />}
          label="When should we nudge you?"
        >
          <View style={styles.optionGrid}>
            {TRIGGERS.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.optionCard, trigger === t.value && styles.optionCardActive]}
                onPress={() => setTrigger(t.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionLabel, trigger === t.value && styles.optionLabelActive]}>
                  {t.label}
                </Text>
                <Text style={[styles.optionDesc, trigger === t.value && styles.optionDescActive]}>
                  {t.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section label="How often?">
          <View style={styles.chipRow}>
            {FREQUENCIES.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.chip, frequency === f.value && styles.chipActive]}
                onPress={() => setFrequency(f.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, frequency === f.value && styles.chipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section label="What time do you usually head out?">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeRow}
          >
            {TIMES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, outingTime === t && styles.timeChipActive]}
                onPress={() => setOutingTime(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeChipText, outingTime === t && styles.timeChipTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Section>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your setup</Text>
          <Text style={styles.summaryLine}>
            Habit: <Text style={styles.summaryValue}>{habitText || '–'}</Text>
          </Text>
          <Text style={styles.summaryLine}>
            Trigger: <Text style={styles.summaryValue}>{TRIGGERS.find(t => t.value === trigger)?.label}</Text>
          </Text>
          <Text style={styles.summaryLine}>
            Nudge: <Text style={styles.summaryValue}>{FREQUENCIES.find(f => f.value === frequency)?.label}</Text>
          </Text>
          <Text style={styles.summaryLine}>
            Outing time: <Text style={styles.summaryValue}>{outingTime}</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Start Correcting</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <View style={styles.sectionIcon}>{icon}</View>}
        <Text style={styles.sectionLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.error,
  },
  charCount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
  },
  optionGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  optionCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  optionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  optionLabelActive: {
    color: colors.accent,
  },
  optionDesc: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  optionDescActive: {
    color: colors.accent + 'AA',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  timeRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  timeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  timeChipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  timeChipTextActive: {
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryLine: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  ctaButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  ctaGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    borderRadius: radius.lg,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: 0.3,
  },
});
