import { PostgrestError } from "@supabase/supabase-js";
import { EcobikeUserStatus } from "../../../constants/app.contants";
import { ReservedEcobikeDto } from "../../../dtos/reserved-ecobike.dto";
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IEcoBikeRepository {
    getAvailableEcoBikesFromEcopoint: (ecopointId: string) => Promise<string[]>;
    reserveEcoBike: (ecobikeId: string, userId: string, timeUsage: number) => Promise<string | undefined>;
    getReservedEcoBike: (userId: string) => Promise<ReservedEcobikeDto | null>;
    cancelEcoBikeReserve: (userId: string) => Promise<string | undefined>;
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

    public async getAvailableEcoBikesFromEcopoint(ecopointId: string): Promise<string[]> {
        const { data, error } = await this.supabase.rpc('get_ecobikes_availables_from_ecopoint', {
            ecopoint_id: ecopointId
        });

        if (error) {
            console.warn(error);
            return [];
        }

        return data.map(({ id }) => id);
    }

    public async reserveEcoBike(ecobikeId: string, userId: string, timeUsage: number) {
        const { error } = await this.supabase
            .from('ecobikes_user')
            .insert({ 
                user_id: userId,
                ecobike_id: ecobikeId,
                tempo_previsto: timeUsage,
                status: EcobikeUserStatus.RESERVADA
            });

        if (error?.message) console.warn(error);

        return error?.details;
    }

    public async getReservedEcoBike(userId: string) {
        const { data, error } = await this.supabase.rpc('get_reserved_ecobike_from_user', {
            current_user_id: userId
        }).single();

        if (error) {
            console.warn(error);
            return null;
        }

        return data;
    }
    
    public async cancelEcoBikeReserve(userId: string) {
        const { error } = await this.supabase
            .from('ecobikes_user')
            .delete()
            .eq('user_id', userId);

        if (error?.message) console.warn(error);        

        return error?.message || error?.details;
    }
}