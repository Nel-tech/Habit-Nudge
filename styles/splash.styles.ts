import {
  StyleSheet,
  Dimensions,
} from 'react-native';

import {
  colors,
  fonts,
} from '@/constants/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stage: {
    width,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  nWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nText: {
    fontSize: 120,
    fontFamily: fonts.bold,
    color: colors.accent,
    lineHeight: 140,
  },

  stickFigure: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 100,
    alignItems: 'center',
  },

  head: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    marginBottom: 2,
  },

  body: {
    width: 2,
    height: 30,
    backgroundColor: colors.accent,
  },

  arm: {
    position: 'absolute',
    width: 2,
    height: 22,
    backgroundColor: colors.accent,
    top: 28,
  },

  armLeft: {
    left: 10,
    transform: [{ rotate: '40deg' }],
  },

  armRight: {
    right: 10,
    transform: [{ rotate: '-40deg' }],
  },

  leg: {
    position: 'absolute',
    width: 2,
    height: 28,
    backgroundColor: colors.accent,
    top: 52,
  },

  legLeft: {
    left: 14,
    transform: [{ rotate: '15deg' }],
  },

  legRight: {
    right: 14,
  },

  textWrapper: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },

  appName: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  tagline: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});