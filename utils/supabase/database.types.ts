export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cantieri: {
        Row: {
          cliente_id: string | null
          created_at: string
          id: string
          nome: string | null
          status: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          nome?: string | null
          status?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          nome?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cantieri_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clienti"
            referencedColumns: ["id"]
          },
        ]
      }
      cantieri_dipendenti: {
        Row: {
          cantieri_id: string
          dipendenti_id: string
        }
        Insert: {
          cantieri_id: string
          dipendenti_id: string
        }
        Update: {
          cantieri_id?: string
          dipendenti_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cantieri_dipendenti_cantieri_id_fkey"
            columns: ["cantieri_id"]
            isOneToOne: false
            referencedRelation: "cantieri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cantieri_dipendenti_dipendenti_id_fkey"
            columns: ["dipendenti_id"]
            isOneToOne: false
            referencedRelation: "dipendenti"
            referencedColumns: ["id"]
          },
        ]
      }
      cantieri_tecnici: {
        Row: {
          cantieri_id: string
          tecnici_id: string
        }
        Insert: {
          cantieri_id: string
          tecnici_id: string
        }
        Update: {
          cantieri_id?: string
          tecnici_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cantieri_tecnici_cantieri_id_fkey"
            columns: ["cantieri_id"]
            isOneToOne: false
            referencedRelation: "cantieri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cantieri_tecnici_tecnici_id_fkey"
            columns: ["tecnici_id"]
            isOneToOne: false
            referencedRelation: "tecnici"
            referencedColumns: ["id"]
          },
        ]
      }
      clienti: {
        Row: {
          aliquote_iva: number | null
          cap: string | null
          codice_destinatario_sdi: string | null
          comune: string | null
          created_at: string
          data_di_nascita: string | null
          denominazione: string
          email: string | null
          id: string
          indirizzo: string | null
          metodo_di_pagamento_predefinito: string | null
          note: string | null
          paese: string | null
          partita_iva: string | null
          pec: string | null
          provincia: string | null
          referente: string | null
          sconto_predefinito: number | null
          telefono: string | null
          tipologia: string | null
        }
        Insert: {
          aliquote_iva?: number | null
          cap?: string | null
          codice_destinatario_sdi?: string | null
          comune?: string | null
          created_at?: string
          data_di_nascita?: string | null
          denominazione: string
          email?: string | null
          id?: string
          indirizzo?: string | null
          metodo_di_pagamento_predefinito?: string | null
          note?: string | null
          paese?: string | null
          partita_iva?: string | null
          pec?: string | null
          provincia?: string | null
          referente?: string | null
          sconto_predefinito?: number | null
          telefono?: string | null
          tipologia?: string | null
        }
        Update: {
          aliquote_iva?: number | null
          cap?: string | null
          codice_destinatario_sdi?: string | null
          comune?: string | null
          created_at?: string
          data_di_nascita?: string | null
          denominazione?: string
          email?: string | null
          id?: string
          indirizzo?: string | null
          metodo_di_pagamento_predefinito?: string | null
          note?: string | null
          paese?: string | null
          partita_iva?: string | null
          pec?: string | null
          provincia?: string | null
          referente?: string | null
          sconto_predefinito?: number | null
          telefono?: string | null
          tipologia?: string | null
        }
        Relationships: []
      }
      dipendenti: {
        Row: {
          cognome: string | null
          costo_orario: number | null
          created_at: string
          id: string
          nome: string | null
        }
        Insert: {
          cognome?: string | null
          costo_orario?: number | null
          created_at?: string
          id?: string
          nome?: string | null
        }
        Update: {
          cognome?: string | null
          costo_orario?: number | null
          created_at?: string
          id?: string
          nome?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          category: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          name: string
          size: number
          storage_path: string
        }
        Insert: {
          category: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          name: string
          size: number
          storage_path: string
        }
        Update: {
          category?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          name?: string
          size?: number
          storage_path?: string
        }
        Relationships: []
      }
      tecnici: {
        Row: {
          cognome: string | null
          email: string | null
          id: string
          nome: string | null
          telefono: string | null
          via: string | null
        }
        Insert: {
          cognome?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          telefono?: string | null
          via?: string | null
        }
        Update: {
          cognome?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          telefono?: string | null
          via?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
