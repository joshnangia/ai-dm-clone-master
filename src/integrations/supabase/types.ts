export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          ai_reply: string
          conversation_type: string | null
          created_at: string
          goal: string | null
          id: string
          original_message: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_reply: string
          conversation_type?: string | null
          created_at?: string
          goal?: string | null
          id?: string
          original_message: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_reply?: string
          conversation_type?: string | null
          created_at?: string
          goal?: string | null
          id?: string
          original_message?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      creator_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          creator_id: string
          end_date: string | null
          has_clone: boolean | null
          id: string
          plan_type: string
          show_dashboard: boolean | null
          start_date: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          creator_id: string
          end_date?: string | null
          has_clone?: boolean | null
          id?: string
          plan_type: string
          show_dashboard?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          creator_id?: string
          end_date?: string | null
          has_clone?: boolean | null
          id?: string
          plan_type?: string
          show_dashboard?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator_subscriptions_creator"
            columns: ["creator_id"]
            isOneToOne: true
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          bio: string | null
          clout_score: number | null
          created_at: string | null
          description: string | null
          holder_count: number | null
          id: string
          market_cap: number | null
          name: string
          perks: Json | null
          social_links: Json | null
          subscription_required_for_clone: boolean | null
          token_price: number | null
          token_supply: number | null
          token_symbol: string
          total_volume: number | null
          username: string
          verified: boolean | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          clout_score?: number | null
          created_at?: string | null
          description?: string | null
          holder_count?: number | null
          id?: string
          market_cap?: number | null
          name: string
          perks?: Json | null
          social_links?: Json | null
          subscription_required_for_clone?: boolean | null
          token_price?: number | null
          token_supply?: number | null
          token_symbol: string
          total_volume?: number | null
          username: string
          verified?: boolean | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          clout_score?: number | null
          created_at?: string | null
          description?: string | null
          holder_count?: number | null
          id?: string
          market_cap?: number | null
          name?: string
          perks?: Json | null
          social_links?: Json | null
          subscription_required_for_clone?: boolean | null
          token_price?: number | null
          token_supply?: number | null
          token_symbol?: string
          total_volume?: number | null
          username?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      creators_backup: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          bio: string | null
          clout_score: number | null
          created_at: string | null
          id: string | null
          name: string | null
          perks: Json | null
          social_links: Json | null
          token_price: number | null
          token_supply: number | null
          token_symbol: string | null
          username: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          clout_score?: number | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          perks?: Json | null
          social_links?: Json | null
          token_price?: number | null
          token_supply?: number | null
          token_symbol?: string | null
          username?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          clout_score?: number | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          perks?: Json | null
          social_links?: Json | null
          token_price?: number | null
          token_supply?: number | null
          token_symbol?: string | null
          username?: string | null
        }
        Relationships: []
      }
      holdings: {
        Row: {
          avg_purchase_price: number | null
          created_at: string | null
          creator_id: string
          id: string
          last_purchase_date: string | null
          tokens_owned: number
          total_invested: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_purchase_price?: number | null
          created_at?: string | null
          creator_id: string
          id?: string
          last_purchase_date?: string | null
          tokens_owned?: number
          total_invested?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_purchase_price?: number | null
          created_at?: string | null
          creator_id?: string
          id?: string
          last_purchase_date?: string | null
          tokens_owned?: number
          total_invested?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_holdings_creator"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_subscriptions: {
        Row: {
          active: boolean | null
          buy_fee_rate: number | null
          can_use_clone: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          plan_type: string
          sell_fee_rate: number | null
          skip_fees: boolean | null
          start_date: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          buy_fee_rate?: number | null
          can_use_clone?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type: string
          sell_fee_rate?: number | null
          skip_fees?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          buy_fee_rate?: number | null
          can_use_clone?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          sell_fee_rate?: number | null
          skip_fees?: boolean | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_wallet: {
        Row: {
          created_at: string | null
          daily_volume: number | null
          fee_breakdown_by_creator: Json | null
          id: string
          last_updated: string | null
          monthly_volume: number | null
          total_buy_fees: number | null
          total_fees_collected: number | null
          total_sell_fees: number | null
        }
        Insert: {
          created_at?: string | null
          daily_volume?: number | null
          fee_breakdown_by_creator?: Json | null
          id?: string
          last_updated?: string | null
          monthly_volume?: number | null
          total_buy_fees?: number | null
          total_fees_collected?: number | null
          total_sell_fees?: number | null
        }
        Update: {
          created_at?: string | null
          daily_volume?: number | null
          fee_breakdown_by_creator?: Json | null
          id?: string
          last_updated?: string | null
          monthly_volume?: number | null
          total_buy_fees?: number | null
          total_fees_collected?: number | null
          total_sell_fees?: number | null
        }
        Relationships: []
      }
      price_history: {
        Row: {
          creator_id: string
          id: string
          price: number
          timestamp: string | null
          volume: number | null
        }
        Insert: {
          creator_id: string
          id?: string
          price: number
          timestamp?: string | null
          volume?: number | null
        }
        Update: {
          creator_id?: string
          id?: string
          price?: number
          timestamp?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          joined: string | null
          perks: Json | null
          role: string | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          joined?: string | null
          perks?: Json | null
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          joined?: string | null
          perks?: Json | null
          role?: string | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      stripe_webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          stripe_event_id: string
          webhook_data: Json
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          stripe_event_id: string
          webhook_data: Json
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          stripe_event_id?: string
          webhook_data?: Json
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      token_holdings: {
        Row: {
          average_price: number
          created_at: string | null
          creator_id: string
          creator_name: string
          id: string
          last_purchase_date: string | null
          last_purchase_price: number | null
          token_symbol: string
          tokens_owned: number
          total_invested: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_price?: number
          created_at?: string | null
          creator_id: string
          creator_name: string
          id?: string
          last_purchase_date?: string | null
          last_purchase_price?: number | null
          token_symbol: string
          tokens_owned?: number
          total_invested?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_price?: number
          created_at?: string | null
          creator_id?: string
          creator_name?: string
          id?: string
          last_purchase_date?: string | null
          last_purchase_price?: number | null
          token_symbol?: string
          tokens_owned?: number
          total_invested?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          creator_id: string | null
          fee_rate: number | null
          gross_amount: number | null
          id: string
          net_amount: number | null
          platform_fee: number | null
          price_per_token: number
          subscription_plan: string | null
          timestamp: string | null
          token_amount: number
          type: string | null
          user_id: string | null
        }
        Insert: {
          creator_id?: string | null
          fee_rate?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          platform_fee?: number | null
          price_per_token: number
          subscription_plan?: string | null
          timestamp?: string | null
          token_amount: number
          type?: string | null
          user_id?: string | null
        }
        Update: {
          creator_id?: string | null
          fee_rate?: number | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          platform_fee?: number | null
          price_per_token?: number
          subscription_plan?: string | null
          timestamp?: string | null
          token_amount?: number
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_backup: {
        Row: {
          creator_id: string | null
          id: string | null
          price_per_token: number | null
          timestamp: string | null
          token_amount: number | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          creator_id?: string | null
          id?: string | null
          price_per_token?: number | null
          timestamp?: string | null
          token_amount?: number | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          creator_id?: string | null
          id?: string | null
          price_per_token?: number | null
          timestamp?: string | null
          token_amount?: number | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          tokens_owned: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          tokens_owned?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          tokens_owned?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          id: string
          wallet_balance: number | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          wallet_balance?: number | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          wallet_balance?: number | null
        }
        Relationships: []
      }
      users_backup: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string | null
          id: string | null
          wallet_balance: number | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          wallet_balance?: number | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          created_at: string | null
          fiat_balance: number | null
          id: string
          last_updated: string | null
          total_deposited: number | null
          total_withdrawn: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fiat_balance?: number | null
          id?: string
          last_updated?: string | null
          total_deposited?: number | null
          total_withdrawn?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fiat_balance?: number | null
          id?: string
          last_updated?: string | null
          total_deposited?: number | null
          total_withdrawn?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_new_price: {
        Args: {
          p_creator_id: string
          p_tokens_traded: number
          p_is_buy: boolean
        }
        Returns: number
      }
      check_clone_access: {
        Args: { p_user_id: string; p_creator_id: string }
        Returns: boolean
      }
      get_user_subscription_plan: {
        Args: { p_user_id: string }
        Returns: {
          plan_type: string
          buy_fee_rate: number
          sell_fee_rate: number
          can_use_clone: boolean
          skip_fees: boolean
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_creator_price: {
        Args: { p_creator_id: string; p_new_price: number; p_volume?: number }
        Returns: undefined
      }
      update_platform_fees: {
        Args: { p_fee_amount: number; p_fee_type: string; p_creator_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
