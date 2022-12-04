import { PostgrestError } from '@supabase/supabase-js';
import { EcobikeUserStatus } from "../../../constants/app.contants";
import { RaceDto } from '../../../dtos/race.dto';
import { ReservedEcobikeDto } from "../../../dtos/reserved-ecobike.dto";
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IEcoBikeRepository {
    getAvailableEcoBikesFromEcopoint: (ecopointId: string) => Promise<string[]>;
    reserveEcoBike: (ecobikeId: string, userId: string, timeUsage: number) => Promise<string | undefined>;
    getReservedEcoBike: (userId: string) => Promise<ReservedEcobikeDto | null>;
    cancelEcoBikeReserve: (userId: string) => Promise<string | undefined>;
    withdrawEcoBike: (userId: string, ecobikeId: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    refundEcoBike: (
        userId: string, 
        ecobikeId: string, 
        ecopointId: string, 
        data: Omit<RaceDto, 'id'>
    ) => Promise<{
        success: boolean;
        error?: string;
    }>;
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
            current_eco_point_id: ecopointId
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
                data_hora_inicial: null,
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

    public async withdrawEcoBike(userId: string, ecobikeId: string) {
        const responseUpdateStatusEcoBikeUser = await this.updateStatusEcoBikeUser(
            userId,
            ecobikeId,
            EcobikeUserStatus.EM_USO
        )

        if (!responseUpdateStatusEcoBikeUser.success) return responseUpdateStatusEcoBikeUser;

        const { error: errorInRemoveEcoBikeFromEcoPoint } = await this.supabase
            .from('ecopoints_slots')
            .update({
                ecobike_id: null,
            })
            .eq('ecobike_id', ecobikeId);


        if (errorInRemoveEcoBikeFromEcoPoint) {
            const responseUpdateStatusEcoBikeUser = await this.updateStatusEcoBikeUser(
                userId,
                ecobikeId,
                EcobikeUserStatus.RESERVADA
            );

            if (!responseUpdateStatusEcoBikeUser.success) return responseUpdateStatusEcoBikeUser;

            return this.formatResponseOnError(errorInRemoveEcoBikeFromEcoPoint);
        }

        return { success: true }
    }

    public async refundEcoBike(
        userId: string, 
        ecobikeId: string, 
        ecopointId: string, 
        data: Omit<RaceDto, 'id'>
    ) {
        const availableSlots = await this.selectAvailableSlots(ecopointId);
        
        if (!availableSlots) return {
            success: false,
            error: 'Ops, o ecopoint selecionado não possui mais slots disponíves'
        }

        const slotId = availableSlots[0];
        const respAddEcoBikeToSlot = await this.addEcoBikeToSlot(slotId, ecobikeId);

        if (!respAddEcoBikeToSlot.success) respAddEcoBikeToSlot;

        const { 
            data: deletedEcoBikeUser, 
            error: errorInDeleteEcoBikeUser 
        } = await this.deleteEcoBikeUser(userId, ecobikeId);

        if (errorInDeleteEcoBikeUser) {
            const respDeleteEcoBikeInSlot = await this.removeEcoBikeInSlot(slotId);
            if (!respDeleteEcoBikeInSlot.success) return respDeleteEcoBikeInSlot;
            return this.formatResponseOnError(errorInDeleteEcoBikeUser);
        }

        const respSaveRaceFromUser = await this.saveRaceFromUser(userId, ecobikeId, data);

        if (!respSaveRaceFromUser.success) {
            const { error: errorInCreateEcobikeUser } = await this.supabase
                .from('ecobikes_user')
                .insert({
                    user_id: userId,
                    ecobike_id: ecobikeId,
                    status: deletedEcoBikeUser?.status as EcobikeUserStatus,
                    tempo_previsto: deletedEcoBikeUser?.tempo_previsto as number,
                    data_hora_inicial: deletedEcoBikeUser?.data_hora_inicial as string,
                });

            if (errorInCreateEcobikeUser) return this.formatResponseOnError(errorInCreateEcobikeUser);

            const respDeleteEcoBikeInSlot = await this.removeEcoBikeInSlot(slotId);
            if (!respDeleteEcoBikeInSlot.success) return respDeleteEcoBikeInSlot;

            return respSaveRaceFromUser;
        }


        return { success: true };
    }

    private async deleteEcoBikeUser(userId: string, ecobikeId: string) {
        const { data, error } = await this.supabase
            .from('ecobikes_user')
            .delete()
            .eq('ecobike_id', ecobikeId)
            .eq('user_id', userId)
            .select()
            .maybeSingle();

        return { data, error }
    }

    private async saveRaceFromUser(userId: string, ecobikeId: string, data: Omit<RaceDto, 'id'>) {
        const { error } = await this.supabase
            .from('races')
            .insert({
                user_id: userId,
                ecobike_Id: ecobikeId,
                tempo: data.tempo,
                faturamento: data.faturamento,
                data_hora_inicial: data.dataHoraInicial,
                data_hora_final: data.dataHoraFinal
            });

        return this.formatResponseOnError(error);
    }

    private async selectAvailableSlots(ecopointId: string): Promise<string[]> {
        const { data, error } = await this.supabase
            .from('ecopoints_slots')
            .select('id')
            .eq('ecopoint_id', ecopointId)
            .is('ecobike_id', null);

        if (error) return [];

        return data.map(({ id }) => id);
    }

    private async addEcoBikeToSlot(slotId: string, ecobikeId: string) {
        const { error } = await this.supabase
            .from('ecopoints_slots')
            .update({
                ecobike_id: ecobikeId
            })
            .eq('id', slotId);

        return this.formatResponseOnError(error);
    }

    private async removeEcoBikeInSlot(slotId: string) {
        const { error } = await this.supabase
            .from ('ecopoints_slots')
            .update({
                ecobike_id: null
            })
            .eq('id', slotId);

        return this.formatResponseOnError(error);
    }

    private async updateStatusEcoBikeUser(
        userId: string, 
        ecobikeId: string, 
        status: EcobikeUserStatus
    ) {
        const dataHoraInicial = status === EcobikeUserStatus.EM_USO ?
            (new Date()).toISOString() :
            null;

        const { status: a, statusText, error } = await this.supabase
            .from('ecobikes_user')
            .update({
                status,
                data_hora_inicial: dataHoraInicial
            })
            .eq('ecobike_id', ecobikeId)
            .eq('user_id', userId);


        return this.formatResponseOnError(error);
    }

    private formatResponseOnError(error: PostgrestError | null) {
        if (!error) return { success: true };

        return {
            success: false,
            error: 
               error?.message || 
               error?.details ||
               'Internal Server Error'
        }

    }
}