export interface IPoint {
    latitude: number;
    longitude: number;
}

export class GeographicPoint {
    private latitude: number;
    private longitude: number;

    constructor({ latitude, longitude }: IPoint) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public distance(other: GeographicPoint): number {
        return this.getDist(
            this.latitude, 
            this.longitude, 
            other.latitude, 
            other.longitude
        );
    }

    public equals(other: GeographicPoint): boolean {
        return this.latitude === other.latitude && this.longitude === other.longitude
    }

    public toJson(): string {
        return JSON.stringify(this.toCordinates());
    }

    public toCordinates(): IPoint {
        return { latitude: this.latitude, longitude: this.longitude }
    }

    private toRad(value: number): number {
        return value * Math.PI / 180;
    }

    private getDist(lat1: number, lng1: number, lat2: number, lng2: number): number {
        // Raio da terra em km
        const R = 6373;
        
        const lat1Rad = this.toRad(lat1);
        const lat2Rad = this.toRad(lat2);
        const deltaLat = this.toRad(lat2 - lat1);
        const deltaLng = this.toRad(lng2 - lng1);

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    	        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    	        Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    	const d = R * c;
    	return d;
    }
}