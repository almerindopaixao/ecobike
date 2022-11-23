import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  modal: {
    backgroundColor: THEME.COLORS.WHITE,
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 43,

    justifyContent: 'space-between',


    width: '90%',


    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontFamily: THEME.FONT_FAMILY.LEXEND.SEMI_BOLD,
    color: THEME.COLORS.TITLE,
    lineHeight: 30
  },

  content: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContent: {
    fontSize: 14,
    fontFamily: THEME.FONT_FAMILY.NUNITO.MEDIUM,
    color: THEME.COLORS.TEXT,
    width: 240,
  },

  button: {
    marginTop: 30,
    height: 50,
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center'
  },

  textButton: {
    fontSize: THEME.FONT_SIZE.MD,
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    color: THEME.COLORS.WHITE
  }
});