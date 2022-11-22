import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface IUserRepository {}

export class UserRepository {
    constructor(
        private supabase: ISupabaseClient
    ) {}
}