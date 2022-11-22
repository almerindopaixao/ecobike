import { ILocationIQRepository } from "../infra/repositories/locationiq/locationiq.repository";

export class GeocodingController {
    private static INSTANCE: GeocodingController;

    constructor(private locationIQRepository: ILocationIQRepository) {}

    public static getInstance(locationIQRepository: ILocationIQRepository): GeocodingController {
        if (!this.INSTANCE) this.INSTANCE = new GeocodingController(locationIQRepository);
        return this.INSTANCE;
    }

    async getLatAndLngFrom(address: string) {
        try {
            const response = await this.locationIQRepository.autocompleteForwardGeocoding(address)
            return response;
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    async getAddressFrom(lat: number, lng: number): Promise<string> {
        try {
            const address = await this.locationIQRepository.reverseGeocoding(lat, lng);
            return address;
        } catch(err) {
            console.error(err);
            return '';
        }
    }
}