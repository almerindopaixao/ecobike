import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IEcoPointRepository {
    listEcoPointsWithAvailableEcoBikes: () => Promise<EcoPointDto[]>
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

    public async listEcoPointsWithAvailableEcoBikes(): Promise<EcoPointDto[]> {
        const { data, error } = await this.supabase.rpc('list_ecopoints');

        if (error) {
            console.warn(error);
            return [];
        }

        return data;
    }
}