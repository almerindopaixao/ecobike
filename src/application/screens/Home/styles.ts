import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.COLORS.PRIMARY,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },

  title: {
    color: THEME.COLORS.WHITE,
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    fontSize: 24,
    marginTop: 15,
    textAlign: 'center'
  },

  actions: {
    flex: 2,
  }
});