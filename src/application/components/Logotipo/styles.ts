import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    fontSize: 14
  },
  image: {
    marginHorizontal: 10,
  }
});