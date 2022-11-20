import { 
    Text, 
    TouchableOpacity, 
    TouchableOpacityProps 
} from 'react-native';

import { styles } from './styles';

interface AppButtonProps extends TouchableOpacityProps {
    text: string;
    marginTop?: number;
    type?: 'primary' | 'secondary';
}

export function AppButton({ text, marginTop = 0, type = 'primary', ...props }: AppButtonProps) {
    const styleButton = { ...styles.button, marginTop };
    const styleText = { ...styles.text };

    switch(type) {
        case 'primary':
            Object.assign(styleButton, { ...styles.buttonPrimary });
            Object.assign(styleText, { ...styles.textPrimary });
            break;
        case 'secondary':
            Object.assign(styleButton, { ...styles.buttonSecondary, ...styles.textSecondary });
            Object.assign(styleText, { ...styles.textSecondary });
            break;
    }

    return (
        <TouchableOpacity style={styleButton} {...props}>
            <Text style={styleText}>{text}</Text>
        </TouchableOpacity>
    )
}