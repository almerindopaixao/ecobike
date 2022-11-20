import { FontAwesome } from '@expo/vector-icons';
import { THEME } from "../../theme";

interface locationMarkerProps {
    size: number;
}

export function LocationMarker({ size }: locationMarkerProps) {
 return (
    <FontAwesome
        name="map-marker" 
        size={size}
        color={THEME.COLORS.PRIMARY} 
    />
 );
}