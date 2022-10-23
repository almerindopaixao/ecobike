import { StyleSheet } from 'react-native';

import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',

    backgroundColor: THEME.COLORS.WHITE,
    padding: 20,
    borderRadius: 30,
  },

  content: {
    width: 265,
  },

  title: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    color: THEME.COLORS.PRIMARY,
    fontSize: 20,
  },

  subtitle: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    color: THEME.COLORS.TEXT,
    fontSize: 15,

    marginTop: 8,
  }
});