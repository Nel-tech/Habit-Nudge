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
    width: 130,
    height: 130,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    flexDirection: 'row',
  },

  hText: {
    fontSize: 64,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    lineHeight: 74,
    marginTop: 6,
  },

  nText: {
    fontSize: 64,
    fontFamily: fonts.bold,
    color: colors.accent,
    lineHeight: 74,
    marginTop: 6,
    marginLeft: -6,
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