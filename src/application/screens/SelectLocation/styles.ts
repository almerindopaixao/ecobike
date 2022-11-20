import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  map: {
    width: "100%",
    height: '100%'
  },

  form: {
    flex: 1,
    backgroundColor: THEME.COLORS.WHITE,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 24,

    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: THEME.COLORS.INPUT,
    borderRadius: 8,
    height: 58,
    width: '100%',
  },

  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 0,
    paddingVertical: 10,
  },

  clearInputIcon: {
    padding: 10
  },

  button: {
    marginTop: 50,
    height: 58,
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: 15,
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  textButton: {
    fontSize: THEME.FONT_SIZE.MD,
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    color: THEME.COLORS.WHITE
  },

  autocomplete: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15,
    position: 'relative',
    zIndex: 3
  },

  autocompleteItem: {
    marginLeft: 10, 
    flexShrink: 1
  },

  autocompleteTextItem: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    color: THEME.COLORS.TEXT
  }
});