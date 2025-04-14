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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
