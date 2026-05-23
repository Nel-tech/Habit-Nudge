import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, spacing, radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
  }, []);

  async function checkOnboarding() {
    const done = await AsyncStorage.getItem('onboarding_done');
    if (done === 'true') {
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D0F14', '#0D1829', '#0D0F14']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View> */}

      <View style={styles.content}>
        {/* <View style={styles.badge}>
          <Text style={styles.badgeText}>Silent. Smart. Effective.</Text>
        </View> */}

        <Text style={styles.headline}>Fix that habit.</Text>
        <Text style={styles.headlineAccent}>No effort required.</Text>

        <Text style={styles.subtext}>
          Your phone nudges you silently.{'\n'}You just correct yourself.
        </Text>

        <View style={styles.featureRow}>
          <FeaturePill label="Custom habits" />
          <FeaturePill label="Silent nudges" />
          <FeaturePill label="Track progress" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/setup')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>No account needed. All data stays on your device.</Text>
      </View>
    </View>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 48,
    paddingHorizontal: spacing.lg,
  },
  glowContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  glow: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#1E3A5F',
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent + '40',
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.textPrimary,
    lineHeight: 54,
    letterSpacing: -1,
  },
  headlineAccent: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.accent,
    lineHeight: 58,
    letterSpacing: -1,
    marginBottom: spacing.lg,
  },
  subtext: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.textSecondary,
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottomSection: {
    gap: spacing.md,
  },
  ctaButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
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
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
