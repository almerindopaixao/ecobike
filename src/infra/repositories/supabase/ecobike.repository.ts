import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IEcoBikeRepository {}

export class EcoBikeRepository {
    constructor(
        private supabase: ISupabaseClient
    ) {}
}