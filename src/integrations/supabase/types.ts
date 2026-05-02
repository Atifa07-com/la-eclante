export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          line1: string
          line2: string | null
          phone: string | null
          postal_code: string
          region: string | null
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          line1: string
          line2?: string | null
          phone?: string | null
          postal_code: string
          region?: string | null
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          line1?: string
          line2?: string | null
          phone?: string | null
          postal_code?: string
          region?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          is_subscription: boolean
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_subscription?: boolean
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_subscription?: boolean
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          active: boolean
          amount: number
          code: string
          created_at: string
          expires_at: string | null
          id: string
          kind: string
          times_used: number
          usage_limit: number | null
        }
        Insert: {
          active?: boolean
          amount: number
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          kind: string
          times_used?: number
          usage_limit?: number | null
        }
        Update: {
          active?: boolean
          amount?: number
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: string
          times_used?: number
          usage_limit?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          is_subscription: boolean
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price_cents: number
        }
        Insert: {
          id?: string
          is_subscription?: boolean
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price_cents: number
        }
        Update: {
          id?: string
          is_subscription?: boolean
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          discount_cents: number
          discount_code: string | null
          email: string
          id: string
          notes: string | null
          shipping_address: Json | null
          shipping_cents: number
          shipping_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_cents?: number
          discount_code?: string | null
          email: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          shipping_cents?: number
          shipping_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          discount_cents?: number
          discount_code?: string | null
          email?: string
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          shipping_cents?: number
          shipping_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          benefits: string[] | null
          concerns: string[] | null
          created_at: string
          description: string | null
          featured: boolean
          how_to_use: string | null
          id: string
          ingredients: string | null
          name: string
          price_cents: number
          routine_step: string | null
          skin_types: string[] | null
          slug: string
          sort_order: number
          stock: number
          subscription_price_cents: number | null
          tagline: string | null
          updated_at: string
          what_it_does: string | null
          who_its_for: string | null
        }
        Insert: {
          active?: boolean
          benefits?: string[] | null
          concerns?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean
          how_to_use?: string | null
          id?: string
          ingredients?: string | null
          name: string
          price_cents: number
          routine_step?: string | null
          skin_types?: string[] | null
          slug: string
          sort_order?: number
          stock?: number
          subscription_price_cents?: number | null
          tagline?: string | null
          updated_at?: string
          what_it_does?: string | null
          who_its_for?: string | null
        }
        Update: {
          active?: boolean
          benefits?: string[] | null
          concerns?: string[] | null
          created_at?: string
          description?: string | null
          featured?: boolean
          how_to_use?: string | null
          id?: string
          ingredients?: string | null
          name?: string
          price_cents?: number
          routine_step?: string | null
          skin_types?: string[] | null
          slug?: string
          sort_order?: number
          stock?: number
          subscription_price_cents?: number | null
          tagline?: string | null
          updated_at?: string
          what_it_does?: string | null
          who_its_for?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          created_at: string
          email: string | null
          id: string
          recommended_product_ids: string[] | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          created_at?: string
          email?: string | null
          id?: string
          recommended_product_ids?: string[] | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          created_at?: string
          email?: string | null
          id?: string
          recommended_product_ids?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          author_name: string
          body: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          title: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          author_name: string
          body?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          title?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          author_name?: string
          body?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          next_ship_at: string | null
          product_id: string
          status: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_ship_at?: string | null
          product_id: string
          status?: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_ship_at?: string | null
          product_id?: string
          status?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
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
      app_role: ["admin", "customer"],
    },
  },
} as const
