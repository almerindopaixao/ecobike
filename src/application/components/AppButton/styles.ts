import { StyleSheet } from 'react-native';
import { THEME } from '../../theme';

export const styles = StyleSheet.create({
    button: {
        height: 58,
        backgroundColor: THEME.COLORS.PRIMARY,
        borderRadius: 8,
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonPrimary: {
        backgroundColor: THEME.COLORS.PRIMARY,
    },

    buttonSecondary: {
        backgroundColor: THEME.COLORS.GREY,
    },

    textPrimary: {
        color: THEME.COLORS.WHITE
    },

    textSecondary: {
        color: THEME.COLORS.TEXT
    },

    text: {
        fontSize: THEME.FONT_SIZE.MD,
        fontFamily: THEME.FONT_FAMILY.LEXEND.BOLD
    },
});