import { StyleSheet } from 'react-native';

import {
  colors,
  fonts,
  spacing,
  radius,
} from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: 32,
    gap: spacing.md,
  },

  header: {
    gap: 6,
    marginBottom: spacing.sm,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.textPrimary,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardLeft: {
    flex: 1,
    gap: spacing.sm,
    marginRight: spacing.md,
  },

  cardHabitText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },

  triggerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },

  triggerBadgeText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },

  streakBlock: {
    alignItems: 'center',
  },

  streakNumber: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.warning,
  },

  streakUnit: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.warning,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    gap: 4,
  },

  statItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },

  statValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textSecondary,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },

  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textSecondary,
  },

  emptySubtext: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },

  emptyHint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});