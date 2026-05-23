import { colors, fonts, spacing, radius } from '@/constants/theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 64,
    paddingBottom: 40,
    gap: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Today nudge count
  nudgeCountCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent + '30',
    alignItems: 'center',
  },
  nudgeCountNumber: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.accent,
    letterSpacing: -1,
  },
  nudgeCountLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.accent,
    opacity: 0.8,
    marginTop: 2,
  },

  // Habit card
  habitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  habitText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  habitMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  habitNudgeRow: {
    flexDirection: 'row',
  },
  habitNudgeBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  habitNudgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.accent,
  },

  // Check-in actions
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  caughtBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  caughtBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
  missedBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  missedBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Archive
  archiveText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // Past habits
  pastBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pastBtnText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  emptyBtn: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  emptyBtnGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});


