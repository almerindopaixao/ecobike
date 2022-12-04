import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  modal: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "space-around",
    alignItems: "center",

    padding: 24,

    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },

  title: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    fontSize: 20,
    color: THEME.COLORS.TITLE
  },

  text: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 16,
    color: THEME.COLORS.TEXT,
    marginBottom: 20,
    lineHeight: 30,
  }
});