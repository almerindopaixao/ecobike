import { PostgrestError } from "@supabase/supabase-js";
import { RaceDto } from "../../../dtos/race.dto";
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IRaceRepository {
    getRacesFromUser: (userId: string) => Promise<RaceDto[]>;
}

export class RaceRepository implements IRaceRepository {
    private static INSTANCE: RaceRepository;

    constructor(
        private supabase: ISupabaseClient
    ) {}

    public static getInstance(supabase: ISupabaseClient): RaceRepository {
        if (!this.INSTANCE) this.INSTANCE = new RaceRepository(supabase);
        return this.INSTANCE;
    }

    public async getRacesFromUser(userId: string) {
        const { data, error } = await this.supabase
            .from('races')
            .select(`
                id,
                tempo,
                faturamento,
                dataHoraInicial:data_hora_inicial,
                dataHoraFinal:data_hora_final
            `)
            .eq('user_id', userId);

        if (error) return [];

        return data;
    }
}