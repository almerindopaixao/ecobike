import { StyleSheet } from 'react-native';

import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',

    backgroundColor: THEME.COLORS.WHITE,
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 30,
  },

  title: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    color: THEME.COLORS.PRIMARY,
    fontSize: 18,
  },

  subtitle: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    color: THEME.COLORS.TEXT,
    fontSize: 14,

    marginTop: 8,
  }
});