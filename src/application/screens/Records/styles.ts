import { Dimensions, StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND,
  },

  contentList: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 24,
    paddingBottom: 24
  },

  emptyRacesText: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    color: THEME.COLORS.TITLE,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,

    marginHorizontal: 50,
  }
});