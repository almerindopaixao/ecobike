import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 60,
    backgroundColor: THEME.COLORS.PRIMARY,
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  disabled: {
    backgroundColor: '#B7B7B7'
  },

  image: {
    width: 90,
    height: 35,
    resizeMode: "cover",
  },

  title: {
    flex: 1,
    fontFamily: THEME.FONT_FAMILY.NUNITO.REGULAR,
    color: THEME.COLORS.WHITE,
    fontSize: 12,
    marginTop: 2
  },
});