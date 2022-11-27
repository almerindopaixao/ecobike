import { Session, User } from '@supabase/supabase-js';
import { EcobikeUserStatus } from '../constants/app.contants';

export interface UserSessionDto extends Session {
    user: User & {
        ecobike: {
            id: string;
            status: EcobikeUserStatus;
            tempoPrevisto: number;
        } | null
    }
}