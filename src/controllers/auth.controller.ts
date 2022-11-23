import { IAuthRepository } from '../infra/repositories/supabase/auth.repository';

export class AuthController {
    private static INSTANCE: AuthController;

    constructor(private authRepository: IAuthRepository) {}

    public static getInstance(authRepository: IAuthRepository): AuthController {
        if (!this.INSTANCE) this.INSTANCE = new AuthController(authRepository);
        return this.INSTANCE;
    }

    public async signUp(email: string, password: string) {
        if (!email || !password) throw new Error('Os campos email e password são obrigatórios');
        const result = await this.authRepository.signUp(email, password);
        return result;
    }

    public async sigIn(email: string, password: string) {
        if (!email || !password) throw new Error('Os campos email e password são obrigatórios');
        const result = await this.authRepository.signIn(email, password);
        return result;
    }

    public async sigOut() {
        const result = await this.authRepository.signOut();
        return result;
    }

    public async session() {
        return this.authRepository.getSession();
    }
}