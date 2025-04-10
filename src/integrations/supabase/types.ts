export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string | null
          email: string
          id: string
          income: number | null
          message: string | null
          name: string
          phone: string | null
          property_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          income?: number | null
          message?: string | null
          name: string
          phone?: string | null
          property_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          income?: number | null
          message?: string | null
          name?: string
          phone?: string | null
          property_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_bot: boolean
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_bot: boolean
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_bot?: boolean
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          archived: boolean | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          time: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          time: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          time?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          created_at: string | null
          description: string
          id: string
          priority: string
          property_id: string
          status: string
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          priority: string
          property_id: string
          status: string
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          property_id?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          accuracy: number
          algorithm: string
          created_at: string
          dataset_name: string
          id: string
          is_trained: boolean | null
          model_data: string | null
          model_predictions: Json | null
          name: string
          neural_network_architecture: Json | null
          parameters: Json | null
          targets: Json | null
          type: string
        }
        Insert: {
          accuracy: number
          algorithm: string
          created_at?: string
          dataset_name: string
          id?: string
          is_trained?: boolean | null
          model_data?: string | null
          model_predictions?: Json | null
          name: string
          neural_network_architecture?: Json | null
          parameters?: Json | null
          targets?: Json | null
          type: string
        }
        Update: {
          accuracy?: number
          algorithm?: string
          created_at?: string
          dataset_name?: string
          id?: string
          is_trained?: boolean | null
          model_data?: string | null
          model_predictions?: Json | null
          name?: string
          neural_network_architecture?: Json | null
          parameters?: Json | null
          targets?: Json | null
          type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          notes: string | null
          payment_method: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status: string
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          id: string
          landlord_id: string
          rent_amount: number | null
          square_feet: number | null
          status: string
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          landlord_id: string
          rent_amount?: number | null
          square_feet?: number | null
          status: string
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          landlord_id?: string
          rent_amount?: number | null
          square_feet?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          lease_end: string
          lease_start: string
          name: string
          property_id: string
          rent_status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lease_end: string
          lease_start: string
          name: string
          property_id: string
          rent_status: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lease_end?: string
          lease_start?: string
          name?: string
          property_id?: string
          rent_status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
  public: {
    Enums: {},
  },
} as const
