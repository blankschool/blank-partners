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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          actor_id: string | null
          client_id: string | null
          client_name: string | null
          created_at: string
          id: string
          message: string | null
          payload: Json | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          id?: string
          message?: string | null
          payload?: Json | null
          type: string
        }
        Update: {
          actor_id?: string | null
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          id?: string
          message?: string | null
          payload?: Json | null
          type?: string
        }
        Relationships: []
      }
      client_contacts: {
        Row: {
          client_id: string
          client_name: string | null
          contato: string | null
          created_at: string
          email: string | null
          funcao: string | null
          id: string
          nome: string | null
          papel: string | null
        }
        Insert: {
          client_id: string
          client_name?: string | null
          contato?: string | null
          created_at?: string
          email?: string | null
          funcao?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string | null
          contato?: string | null
          created_at?: string
          email?: string | null
          funcao?: string | null
          id?: string
          nome?: string | null
          papel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_goals: {
        Row: {
          calendar: string | null
          client_id: string
          client_name: string | null
          conta: string | null
          created_at: string
          data: string | null
          descricao: string | null
          id: string
          marcos: string | null
          meta: string | null
          periodo: string | null
          plataforma: string | null
          status: string | null
          status_marcos: string | null
          updated_at: string
          valor_alvo: number | null
          valor_atual: number | null
        }
        Insert: {
          calendar?: string | null
          client_id: string
          client_name?: string | null
          conta?: string | null
          created_at?: string
          data?: string | null
          descricao?: string | null
          id?: string
          marcos?: string | null
          meta?: string | null
          periodo?: string | null
          plataforma?: string | null
          status?: string | null
          status_marcos?: string | null
          updated_at?: string
          valor_alvo?: number | null
          valor_atual?: number | null
        }
        Update: {
          calendar?: string | null
          client_id?: string
          client_name?: string | null
          conta?: string | null
          created_at?: string
          data?: string | null
          descricao?: string | null
          id?: string
          marcos?: string | null
          meta?: string | null
          periodo?: string | null
          plataforma?: string | null
          status?: string | null
          status_marcos?: string | null
          updated_at?: string
          valor_alvo?: number | null
          valor_atual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_meetings: {
        Row: {
          client_id: string
          client_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          meeting_date: string
          meeting_link: string
          meeting_period: string | null
          report_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          meeting_date: string
          meeting_link: string
          meeting_period?: string | null
          report_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          meeting_date?: string
          meeting_link?: string
          meeting_period?: string | null
          report_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_meetings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "client_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_meetings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "client_reports_view"
            referencedColumns: ["id"]
          },
        ]
      }
      client_reports: {
        Row: {
          client_id: string
          client_name: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          reference_date: string
          report_link: string | null
          report_period: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          reference_date: string
          report_link?: string | null
          report_period?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          reference_date?: string
          report_link?: string | null
          report_period?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_scope_actuals: {
        Row: {
          client_id: string
          client_name: string | null
          created_at: string
          id: string
          instagram: number | null
          linkedin_posts: number | null
          month: string
          recordings: number | null
          tiktok_posts: number | null
          updated_at: string
          youtube_shorts: number | null
          youtube_videos: number | null
        }
        Insert: {
          client_id: string
          client_name?: string | null
          created_at?: string
          id?: string
          instagram?: number | null
          linkedin_posts?: number | null
          month: string
          recordings?: number | null
          tiktok_posts?: number | null
          updated_at?: string
          youtube_shorts?: number | null
          youtube_videos?: number | null
        }
        Update: {
          client_id?: string
          client_name?: string | null
          created_at?: string
          id?: string
          instagram?: number | null
          linkedin_posts?: number | null
          month?: string
          recordings?: number | null
          tiktok_posts?: number | null
          updated_at?: string
          youtube_shorts?: number | null
          youtube_videos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_scope_actuals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_scopes: {
        Row: {
          client_id: string
          client_name: string | null
          created_at: string
          id: string
          instagram: number | null
          linkedin_posts: number | null
          recordings: number | null
          tiktok_posts: number | null
          updated_at: string
          youtube_shorts: number | null
          youtube_videos: number | null
        }
        Insert: {
          client_id: string
          client_name?: string | null
          created_at?: string
          id?: string
          instagram?: number | null
          linkedin_posts?: number | null
          recordings?: number | null
          tiktok_posts?: number | null
          updated_at?: string
          youtube_shorts?: number | null
          youtube_videos?: number | null
        }
        Update: {
          client_id?: string
          client_name?: string | null
          created_at?: string
          id?: string
          instagram?: number | null
          linkedin_posts?: number | null
          recordings?: number | null
          tiktok_posts?: number | null
          updated_at?: string
          youtube_shorts?: number | null
          youtube_videos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_scopes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          contract_start_date: string | null
          created_at: string
          editorial_calendar_db_id: string | null
          external_account_id: string | null
          id: string
          name: string
          notion_source_page_id: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          updated_at: string | null
        }
        Insert: {
          contract_start_date?: string | null
          created_at?: string
          editorial_calendar_db_id?: string | null
          external_account_id?: string | null
          id?: string
          name: string
          notion_source_page_id?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
        }
        Update: {
          contract_start_date?: string | null
          created_at?: string
          editorial_calendar_db_id?: string | null
          external_account_id?: string | null
          id?: string
          name?: string
          notion_source_page_id?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          description: string | null
          id: string
          is_read: boolean | null
          link: string | null
          payload: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          payload?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          payload?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_cache: {
        Row: {
          blocks: Json
          cached_at: string
          page_id: string
          title: string
        }
        Insert: {
          blocks: Json
          cached_at?: string
          page_id: string
          title?: string
        }
        Update: {
          blocks?: Json
          cached_at?: string
          page_id?: string
          title?: string
        }
        Relationships: []
      }
      painel_de_conteudos: {
        Row: {
          cliente: string
          created_at: string | null
          data: string | null
          estagio: string | null
          formato: string | null
          "id do conteúdo": string
          legenda: string | null
          notion_page_id: string | null
          plataforma: string | null
          preview_url: string | null
          sm: string | null
          sm_responsavel: string | null
          status: string | null
          titulo: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data?: string | null
          estagio?: string | null
          formato?: string | null
          "id do conteúdo": string
          legenda?: string | null
          notion_page_id?: string | null
          plataforma?: string | null
          preview_url?: string | null
          sm?: string | null
          sm_responsavel?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data?: string | null
          estagio?: string | null
          formato?: string | null
          "id do conteúdo"?: string
          legenda?: string | null
          notion_page_id?: string | null
          plataforma?: string | null
          preview_url?: string | null
          sm?: string | null
          sm_responsavel?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      post_approval_history: {
        Row: {
          action: string
          created_at: string
          feedback: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          feedback?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          feedback?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          position_id: string | null
          team: Database["public"]["Enums"]["team_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string
          id?: string
          position_id?: string | null
          team?: Database["public"]["Enums"]["team_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          position_id?: string | null
          team?: Database["public"]["Enums"]["team_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_clients: {
        Row: {
          client_id: string
          client_name: string | null
          created_at: string
          id: string
          team_member_id: string
        }
        Insert: {
          client_id: string
          client_name?: string | null
          created_at?: string
          id?: string
          team_member_id: string
        }
        Update: {
          client_id?: string
          client_name?: string | null
          created_at?: string
          id?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_clients_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          area: Database["public"]["Enums"]["team_type"] | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          integration_id: string | null
          leader_id: string | null
          notion_id: string | null
          phone: string | null
          position: string | null
          profile_id: string | null
          role: string | null
          seniority: Database["public"]["Enums"]["seniority_level"] | null
          squad: string | null
          start_date: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          area?: Database["public"]["Enums"]["team_type"] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          integration_id?: string | null
          leader_id?: string | null
          notion_id?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          role?: string | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          squad?: string | null
          start_date?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          area?: Database["public"]["Enums"]["team_type"] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          integration_id?: string | null
          leader_id?: string | null
          notion_id?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          role?: string | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          squad?: string | null
          start_date?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "team_members_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          role: Database["public"]["Enums"]["app_role"]
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
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          metadata?: Json | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      activity_feed_view: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          id: string | null
          message: string | null
          payload: Json | null
          type: string | null
        }
        Relationships: []
      }
      client_contacts_view: {
        Row: {
          client_id: string | null
          client_name: string | null
          contato: string | null
          created_at: string | null
          email: string | null
          funcao: string | null
          id: string | null
          nome: string | null
          papel: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_goals_view: {
        Row: {
          calendar: string | null
          client_id: string | null
          client_name: string | null
          conta: string | null
          created_at: string | null
          data: string | null
          descricao: string | null
          id: string | null
          marcos: string | null
          meta: string | null
          periodo: string | null
          plataforma: string | null
          status: string | null
          status_marcos: string | null
          updated_at: string | null
          valor_alvo: number | null
          valor_atual: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_meetings_view: {
        Row: {
          client_id: string | null
          client_name: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          meeting_date: string | null
          meeting_link: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_reports_view: {
        Row: {
          client_id: string | null
          client_name: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string | null
          reference_date: string | null
          report_link: string | null
          report_period: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_clients_view: {
        Row: {
          area: Database["public"]["Enums"]["team_type"] | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          id: string | null
          member_name: string | null
          position: string | null
          team_member_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_member_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_clients_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_agency: { Args: never; Returns: boolean }
      is_agency: { Args: never; Returns: boolean }
      process_post_approval: {
        Args: {
          p_action: string
          p_feedback?: string
          p_post_id: string
          p_user_id: string
        }
        Returns: Json
      }
      user_owns_client: { Args: { _client_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "client" | "agency"
      client_status:
        | "kickoff"
        | "diagnostico"
        | "apresentacao_planejamento"
        | "30d"
        | "60d"
        | "90d"
        | "ongoing"
        | "cancelado"
      seniority_level: "Júnior" | "Pleno" | "Sênior"
      team_type:
        | "Creative"
        | "Marketing"
        | "Client Services"
        | "Operations"
        | "Social Media"
        | "Criação"
        | "Diretoria"
        | "Comercial"
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
      app_role: ["admin", "user", "client", "agency"],
      client_status: [
        "kickoff",
        "diagnostico",
        "apresentacao_planejamento",
        "30d",
        "60d",
        "90d",
        "ongoing",
        "cancelado",
      ],
      seniority_level: ["Júnior", "Pleno", "Sênior"],
      team_type: [
        "Creative",
        "Marketing",
        "Client Services",
        "Operations",
        "Social Media",
        "Criação",
        "Diretoria",
        "Comercial",
      ],
    },
  },
} as const
