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
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    fontSize: 20,
    color: THEME.COLORS.TITLE,
    marginBottom: 10
  },

  modeloLabel: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5
  },

  text: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.REGULAR,
    color: THEME.COLORS.TEXT,
  },

  modelo: {
    fontSize: 19,
    textAlign: 'center',

    backgroundColor: '#E3FFF0',
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 8
  },

  price: {
    textAlign: 'center',
    fontSize: 32
  },

  distance: {
    textAlign: 'center',
    fontSize: 13
  },

  warn: {
    backgroundColor: '#FEFFE3',

    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  warnText: {
    fontSize: 13,
  },

  info: {
    alignItems: 'center',
    marginVertical: 20
  },

  buttonsContainer: {
    width: '100%',
    marginTop: 20
  }
});