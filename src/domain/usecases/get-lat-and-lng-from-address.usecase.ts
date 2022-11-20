import { ILocationIQRepository } from "../../infra/repositories/locationiq/locationiq.repository";

export class GetLatAndLngFromAddressUseCase {
    private static INSTANCE: GetLatAndLngFromAddressUseCase;

    constructor(private locationIQRepository: ILocationIQRepository) {}

    public static getInstance(locationIQRepository: ILocationIQRepository): GetLatAndLngFromAddressUseCase {
        if (!this.INSTANCE) this.INSTANCE = new GetLatAndLngFromAddressUseCase(locationIQRepository);
        return this.INSTANCE;
    }

    async execute(address: string) {
        try {
            const response = await this.locationIQRepository.autocompleteForwardGeocoding(address)
            return response;
        } catch(err) {
            console.warn(err);
            return [];
        }
    }
}