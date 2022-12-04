import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.WHITE,

    marginVertical: 15,
    

    borderRadius: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 30,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 10
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  status: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.REGULAR,
    color: THEME.COLORS.TEXT,
    fontSize: 14
  },

  text: {
    fontFamily: THEME.FONT_FAMILY.NUNITO.REGULAR,
    color: THEME.COLORS.TEXT,
    fontSize: 14,
    marginLeft: 10
  }
});