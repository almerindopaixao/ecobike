import Constants from 'expo-constants';

import { IClientHttp } from "../../http/client.http";
import { LocationDto } from '../../../dtos/location.dto';

export interface LocationIQApiResponse {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    boundingbox: string[];
    address: {
        name: string;
        suburb?: string;
        city: string;
        county: string;
        state: string;
        postcode: string;
        country: string;
        country_code: string;
    }
}

export interface ILocationIQRepository {
    reverseGeocoding: (lat: number, lng: number) => Promise<string>;
    autocompleteForwardGeocoding: (address: string) => Promise<LocationDto[]>
}

export class LocationIQRepository implements ILocationIQRepository {
    private static INSTANCE: LocationIQRepository;
    private LOCATION_IQ_URL: string = Constants.expoConfig?.extra?.LOCATION_IQ_URL;
    private LOCATION_IQ_KEY: string = Constants.expoConfig?.extra?.LOCATION_IQ_KEY;

    private locationiqReverseGeocodingUrl: string = 
        `${this.LOCATION_IQ_URL}/reverse?format=json&key=${this.LOCATION_IQ_KEY}`;
    private locationiqForwardGeocodingUrl: string = 
        `${this.LOCATION_IQ_URL}/search?format=json&key=${this.LOCATION_IQ_KEY}`;
    private locationiqAutocompleteForwardGeocodingUrl: string = 
        `${this.LOCATION_IQ_URL}/autocomplete?format=json&key=${this.LOCATION_IQ_KEY}`;

    constructor(private clientHttp: IClientHttp) {}

    public static getInstance(clientHttp: IClientHttp): LocationIQRepository {
        if (!this.INSTANCE) this.INSTANCE = new LocationIQRepository(clientHttp);
        return this.INSTANCE;
    }

    public async autocompleteForwardGeocoding(address: string) {
        const url = `${this.locationiqAutocompleteForwardGeocodingUrl}&q=${address}`;
        const { status, data } = await this.clientHttp.get<LocationIQApiResponse[]>(url);

        if (status !== 200) return [];
        
        return data.map(({ address, lat, lon }) => (
            { 
                address: {
                    name: address.name,
                    suburb: address.suburb,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                }, 
                latitude: +lat, 
                longitude: +lon 
            }
        ));
    }

    public async reverseGeocoding(lat: number, lng: number) {
        const url = `${this.locationiqReverseGeocodingUrl}&lat=${lat}&lon=${lng}`;
        const { status, data } = await this.clientHttp.get<LocationIQApiResponse>(url);

        if (status !== 200) return '';

        return data.display_name;
    }
}