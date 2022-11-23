import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: THEME.COLORS.BACKGROUND,
    padding: 30
  },

  title: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    fontSize: 30,
    color: THEME.COLORS.WHITE
  },

  input: {
    backgroundColor: THEME.COLORS.WHITE,
    borderRadius: 8,
    padding: 10,
    height: 50,

    marginTop: 25,
    width: '100%',
  },

  inputError: {
    borderWidth: 1,
    borderColor: THEME.COLORS.ERROR
  },

  msgError: {
    color: THEME.COLORS.ERROR,
  },

  msg: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 12,
    color: THEME.COLORS.BACKGROUND,
    
    width: '100%',
    textAlign: 'left',

    marginTop: 6,
  }
});