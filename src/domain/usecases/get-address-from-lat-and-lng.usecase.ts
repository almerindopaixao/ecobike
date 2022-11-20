import { ILocationIQRepository } from "../../infra/repositories/locationiq/locationiq.repository";

export class GetAddressFromLatAndLngUseCase {
    private static INSTANCE: GetAddressFromLatAndLngUseCase;

    constructor(private locationIQRepository: ILocationIQRepository) {}

    public static getInstance(locationIQRepository: ILocationIQRepository): GetAddressFromLatAndLngUseCase {
        if (!this.INSTANCE) this.INSTANCE = new GetAddressFromLatAndLngUseCase(locationIQRepository);
        return this.INSTANCE;
    }

    async execute(lat: number, lng: number): Promise<string> {
        try {
            const address = await this.locationIQRepository.reverseGeocoding(lat, lng);
            return address;
        } catch(err) {
            console.warn(err);
            return '';
        }
    }
}