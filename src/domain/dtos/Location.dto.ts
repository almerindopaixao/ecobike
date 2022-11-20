export interface LocationDto {
    latitude: number;
    longitude: number;
    address: {
        name: string;
        suburb?: string;
        city: string;
        state: string;
        country: string;
    }
}