import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import { createClient, SupabaseClient, } from '@supabase/supabase-js';

import { Database } from './supabase.schema';

const { 
    SUPABASE_URL = '',
    SUPABASE_KEY = '' 
} = Constants.expoConfig?.extra || {};

export type ISupabaseClient = SupabaseClient<Database, "public", Database['public']>
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
});