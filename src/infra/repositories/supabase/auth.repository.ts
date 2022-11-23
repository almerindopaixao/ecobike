import { AuthError, Session } from "@supabase/supabase-js";
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface AuthResponse {
    success: boolean;
    errorMessage?: string;
}

export interface IAuthRepository {
    signUp: (email: string, password: string) => Promise<AuthResponse>,
    signIn: (email: string, password: string) => Promise<AuthResponse & { session: Session | null }>
    signOut: () => Promise<AuthResponse>,
    getSession: () => Promise<AuthResponse & { session: Session | null }>
}

export class AuthRepository implements IAuthRepository {
    private static INSTANCE: AuthRepository;

    constructor(
        private supabase: ISupabaseClient
    ) {}

    public static getInstance(supabase: ISupabaseClient): AuthRepository {
        if (!this.INSTANCE) this.INSTANCE = new AuthRepository(supabase);
        return this.INSTANCE;
    }

    private formatResponse(error: AuthError | null) {
        if (!error) return { success: true };
        return { 
            success: false, 
            errorMessage: error.message 
        }
    }

    public async signUp(email: string, password: string) {
        const { error } = await this.supabase.auth.signUp({
            email: email,
            password: password,
        });

        return this.formatResponse(error);
    }

    public async signIn(email: string, password: string): Promise<AuthResponse & { session: Session | null }> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        return { 
            ...this.formatResponse(error),
            session: data.session
        }
    }

    public async signOut() {
        const { error } = await this.supabase.auth.signOut();
        return this.formatResponse(error);
    }

    public async getSession(): Promise<AuthResponse & { session: Session | null }> {
        const { data, error } = await this.supabase.auth.getSession();

        return { 
            ...this.formatResponse(error),
            session: data.session
        }
    }
}