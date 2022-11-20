import axios from 'axios';

export interface ClientHttpResponse<T> {
    status: number;
    data: T
}

export interface IClientHttp {
    get: <T>(url: string) => Promise<ClientHttpResponse<T>>;
}


export class ClientHttp implements IClientHttp {
    private static INSTANCE: ClientHttp;

    axiosClient = axios.create({
        validateStatus() {
            return true;
        },
    });

    public static getInstance(): ClientHttp {
        if (!this.INSTANCE) this.INSTANCE = new ClientHttp();
        return this.INSTANCE;
    }

    public async get<T>(url: string) {
        const { status, data } = await this.axiosClient.get<T>(url);
        return { status, data }
    }
}