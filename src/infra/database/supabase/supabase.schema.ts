export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ecobikes: {
        Row: {
          id: string
          ecopoint_id: string
          num_serie: string
          modelo: string
          ultima_manutencao: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          ecopoint_id: string
          num_serie: string
          modelo: string
          ultima_manutencao: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          ecopoint_id?: string
          num_serie?: string
          modelo?: string
          ultima_manutencao?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      ecopoints: {
        Row: {
          id: string
          nome: string
          logradouro: string
          bairro: string
          cidade: string
          estado: string
          numero: string | null
          imagem_url: string
          funcionamento_inicio: number
          functionamento_fim: number
          latitude: number
          longitude: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          logradouro: string
          bairro: string
          cidade: string
          estado: string
          numero?: string | null
          imagem_url: string
          funcionamento_inicio: number
          functionamento_fim: number
          latitude: number
          longitude: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          logradouro?: string
          bairro?: string
          cidade?: string
          estado?: string
          numero?: string | null
          imagem_url?: string
          funcionamento_inicio?: number
          functionamento_fim?: number
          latitude?: number
          longitude?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reservas: {
        Row: {
          ecobike_id: string
          user_id: string
          tempo_previsto: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          ecobike_id: string
          user_id: string
          tempo_previsto: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ecobike_id?: string
          user_id?: string
          tempo_previsto?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
