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

  autocomplete: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15,
    position: 'relative'
  },

  autocompleteItem: {
    marginLeft: 10, 
    flexShrink: 1
  },

  autocompleteTextItem: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.LEXEND.REGULAR,
    color: THEME.COLORS.TEXT
  },

  info: {
    position: 'absolute', 
    backgroundColor: '#000',
    opacity: 0.8,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  infoTitle: {
    marginHorizontal: 20,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 20,
    fontSize: 20,
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    color: THEME.COLORS.WHITE
  }
});