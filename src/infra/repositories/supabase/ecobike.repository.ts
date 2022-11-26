import { ISupabaseClient } from "../../database/supabase/supabase.database";

interface ReservedEcoBikeResponse {
    tempoPrevisto: number;
    ecoBike: {
        numSerie: string;
        ecoPoint: {
            name: string;
            image: string;
            latitude: number;
            longitude: number;
        }
    }
}

export interface IEcoBikeRepository {
    getAvailableEcoBikes: (ecopointId: string) => Promise<string[]>;
    reserveEcoBike: (ecobikeId: string, userId: string, timeUsage: number) => Promise<string | undefined>;
    getReservedEcoBike: (userId: string) => Promise<ReservedEcoBikeResponse | null>;
}

export class EcoBikeRepository implements IEcoBikeRepository {
    private static INSTANCE: EcoBikeRepository;

    constructor(
        private supabase: ISupabaseClient
    ) {}

    public static getInstance(supabase: ISupabaseClient): EcoBikeRepository {
        if (!this.INSTANCE) this.INSTANCE = new EcoBikeRepository(supabase);
        return this.INSTANCE;
    }

    public async getAvailableEcoBikes(ecopointId: string) {
        const { data, error } = await this.supabase
            .from('ecobikes')
            .select('id, reservas(ecobike_id)')
            .eq('ecopoint_id', ecopointId);

        if (error) {
            console.warn(error);
            return [];
        }

        const availableEcoBikes = data.reduce<string[]>((acc, { id, reservas }) => {
            if (Array.isArray(reservas) && reservas.length) return acc;
            acc.push(id);
            return acc;
        }, [])

        return availableEcoBikes;
    }

    public async reserveEcoBike(ecobikeId: string, userId: string, timeUsage: number) {
        const { error } = await this.supabase
            .from('reservas')
            .insert({ 
                user_id: userId, 
                ecobike_id: ecobikeId,
                tempo_previsto: timeUsage
            });
            
        return error?.details;
    }

    public async getReservedEcoBike(userId: string) {
        const { data, error } = await this.supabase
            .from('reservas')
            .select(`
                tempoPrevisto:tempo_previsto,
                ecoBike:ecobikes(
                    numSerie:num_serie,
                    ecoPoint:ecopoints(
                        name:nome,
                        image:imagem_url_sm,
                        latitude, 
                        longitude
                    )
                )
            `,)
            .eq('user_id', userId)
            .single();

        if (error) {
            console.warn(error);
            return null;
        }

        return data as unknown as ReservedEcoBikeResponse
    }
}