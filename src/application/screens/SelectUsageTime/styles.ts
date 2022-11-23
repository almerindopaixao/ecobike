import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',

    paddingHorizontal: 24,
    paddingVertical: 43
  },

  formGroup: {
    flex: 1,
    width: '100%'
  },

  label: {
    fontSize: 18,
    fontFamily: THEME.FONT_FAMILY.NUNITO.SEMI_BOLD,
    color: THEME.COLORS.TITLE
  },

  input: {
    height: 50,
    padding: 10,
    backgroundColor: THEME.COLORS.WHITE,
    borderRadius: 8,
    marginTop: 20
  },

  msgError: {
    marginTop: 10,
    color: THEME.COLORS.ERROR,
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.NUNITO.REGULAR,
  },

  inputError: {
    borderColor: THEME.COLORS.ERROR,
    borderWidth: 1
  }
});