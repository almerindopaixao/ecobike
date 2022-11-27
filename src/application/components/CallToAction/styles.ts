import { StyleSheet } from 'react-native';

import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'space-between',

    backgroundColor: THEME.COLORS.WHITE,
    padding: 30,
    marginHorizontal: 10,
    borderRadius: 20,

    height: 200,
    width: 180,
  },

  title: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    color: THEME.COLORS.PRIMARY,
    fontSize: 16,
    textAlign: 'center',
  },
});