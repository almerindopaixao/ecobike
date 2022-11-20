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

  mapMarkerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapMarkerTitle: {
    fontSize: 11,
    fontFamily: THEME.FONT_FAMILY.NUNITO.EXTRA_BOLD,
    color: THEME.COLORS.PRIMARY,
  },

  mapMarker: {
    width: 90,
    height: 70,
  },
});