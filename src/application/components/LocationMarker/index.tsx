import { FontAwesome } from '@expo/vector-icons';
import { THEME } from "../../theme";

interface locationMarkerProps {
    size: number;
    color?: string;
}

export function LocationMarker(
    { 
        size, 
        color = THEME.COLORS.PRIMARY 
    }: locationMarkerProps) {
 return (
    <FontAwesome
        name="map-marker" 
        size={size}
        color={color} 
    />
 );
}