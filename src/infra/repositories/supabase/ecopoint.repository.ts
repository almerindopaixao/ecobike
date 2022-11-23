import { EcoPointDto } from '../../../dtos/ecopoint.dto';
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IEcoPointRepository {
    listEcoPoints: () => Promise<EcoPointDto[]>
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

    public async listEcoPoints(): Promise<EcoPointDto[]> {
        const { data, error } = await this.supabase
            .from('ecopoints')
            .select(`
                id,
                nome,
                logradouro,
                bairro,
                cidade,
                estado,
                numero,
                imagemMd:imagem_url_md,
                imagemSm:imagem_url_sm,
                funcionamentoInicio:funcionamento_inicio,
                functionamentoFim:functionamento_fim,
                latitude,
                longitude
            `);

        if (error) {
            console.warn(error);
            return [];
        }

        return data;
    }
}