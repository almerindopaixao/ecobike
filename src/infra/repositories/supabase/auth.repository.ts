import { AuthError, PostgrestError, Session } from "@supabase/supabase-js";
import { UserSessionDto } from '../../../dtos/user-session.dto';
import { ISupabaseClient } from "../../database/supabase/supabase.database";

export interface AuthResponse {
    success: boolean;
    errorMessage?: string;
}

export interface IAuthRepository {
    signUp: (email: string, password: string) => Promise<AuthResponse>,
    signIn: (email: string, password: string) => Promise<AuthResponse & { session: UserSessionDto | null }>
    signOut: () => Promise<AuthResponse>,
    getSession: () => Promise<AuthResponse & { session: UserSessionDto | null }>
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

    private formatResponse(error: AuthError | PostgrestError | null) {
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

    private async buildUserSession(
        session: Session | null
    ): Promise<[UserSessionDto | null, PostgrestError | null]> {
        if (!session) return [null, null];

        const { data, error } = await this.supabase
            .from('ecobikes_user')
            .select(`
                id:ecobike_id,
                status,
                tempoPrevisto:tempo_previsto,
                ecobikes(
                    numSerie:num_serie
                )
            `)
            .eq('user_id', session.user.id)
            .maybeSingle();

        if (error) {
            console.warn(error);
            return [null, error];
        }

        const responseSession = {
            ...session,
            user: {
                ...session.user,
                ecobike: data ? {
                    id: data.id,
                    status: data.status,
                    tempoPrevisto: data.tempoPrevisto,
                    numSerie: (data.ecobikes as { numSerie: string }).numSerie
                } : 
                null 
            }
        }

        return [responseSession, null]
    }

    public async signIn(email: string, password: string): Promise<AuthResponse & { session: UserSessionDto | null }> {
        const { data, error: errorInSignIn } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (errorInSignIn) return { 
            ...this.formatResponse(errorInSignIn),
            session: null
        }

        const [session, error] = await this.buildUserSession(data.session);

        return { 
            ...this.formatResponse(error),
            session,
        }
    }

    public async signOut() {
        const { error } = await this.supabase.auth.signOut();
        return this.formatResponse(error);
    }

    public async getSession(): Promise<AuthResponse & { session: UserSessionDto | null }> {
        const { data, error: errorInGetSession } = await this.supabase.auth.getSession();

        if (errorInGetSession) return { 
            ...this.formatResponse(errorInGetSession),
            session: null
        }

        const [session, error] = await this.buildUserSession(data.session);

        return { 
            ...this.formatResponse(error),
            session
        }
    }
}