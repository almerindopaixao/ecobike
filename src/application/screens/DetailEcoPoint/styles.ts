import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  imageCover: {
    width: '100%', 
    height: 120,
    resizeMode: 'contain', 
    borderRadius: 6
  },

  mainTitle: {
    fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD,
    fontSize: 30,
    color: '#3D3D4D',
    marginTop: 15
  },

  sectionTitle: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.BOLD,
    fontSize: 20,
    color: THEME.COLORS.TITLE,
  },

  valueText: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.EXTRA_BOLD,
    fontSize: 20,
    color: THEME.COLORS.PRIMARY
  },

  addressText: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.MEDIUM,
    fontSize: THEME.FONT_SIZE.MD,
    color: THEME.COLORS.TEXT,
    lineHeight: 25
  },

  buttonsContainer: {
    width: '90%',
  },

  sectionContainer: {
    width: '90%'
  }
});