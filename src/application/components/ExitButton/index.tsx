import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import { THEME } from '../../theme';

interface ExitButtonProps extends TouchableOpacityProps {
    color?: string;
}

export function ExitButton({ color = THEME.COLORS.WHITE, ...props }: ExitButtonProps) {
    return (
        <TouchableOpacity { ...props }>
            <MaterialIcons 
                name='logout'
                color={color}
                size={30}
            />
        </TouchableOpacity>
    );
}