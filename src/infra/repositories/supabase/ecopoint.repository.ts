import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { ISupabaseClient, supabase } from "../../database/supabase/supabase.database";

export type ListEcoPoints = 
    Pick<EcoPointDto, 'id'|'nome'|'imagem'|'latitude'|'longitude'>[];

export interface IEcoPointRepository {
    listEcoPoints: () => Promise<ListEcoPoints>
}

export class EcoPointRepository implements IEcoPointRepository {
    private static INSTANCE: EcoPointRepository;

    constructor(
        private supabase: ISupabaseClient
    ) {}

    public static getInstance(supabase: ISupabaseClient): EcoPointRepository {
        if (!this.INSTANCE) this.INSTANCE = new EcoPointRepository(supabase);
        return this.INSTANCE;
    }

    public async listEcoPoints(): Promise<ListEcoPoints> {
        const { data, error, count, status } = await this.supabase
            .from('ecopoints')
            .select('id, nome, imagem:imagem_url, latitude, longitude');

        if (error) {
            console.warn(error);
            return [];
        }

        return data;
    }
}