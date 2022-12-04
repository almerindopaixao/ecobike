import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: '100%'
  },

  card: {
    flex: 1,
    backgroundColor: THEME.COLORS.WHITE,
    borderRadius: 15,
    marginHorizontal: 20,

    position: 'absolute',
    bottom: 70,
    right: 0,
    left: 0,

    borderBottomColor: THEME.COLORS.PRIMARY,
    borderBottomWidth: 40
  },

  content: {
    padding: 24
  },

  titleCard: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 18,
    color: THEME.COLORS.TITLE,
    textAlign: 'center'
  },

  textTimeCard: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 26,
    color: THEME.COLORS.TEXT,
    textAlign: 'center',

    marginTop: 30,
    marginBottom: 15
  },

  textDistanceCard: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 16,
    color: THEME.COLORS.TEXT,
    textAlign: 'center',

    marginBottom: 20
  },

  mapMarker: {
    width: 90,
    height: 70,
  },
});