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
          created_at: string | null
          id: string
          message: string | null
          payload: Json | null
          project_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          payload?: Json | null
          project_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          payload?: Json | null
          project_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          bucket_path: string
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          integration_id: string | null
          notion_page_id: string | null
          post_id: string | null
          social_profile_id: string | null
          source_url: string | null
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket_path: string
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          integration_id?: string | null
          notion_page_id?: string | null
          post_id?: string | null
          social_profile_id?: string | null
          source_url?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket_path?: string
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          integration_id?: string | null
          notion_page_id?: string | null
          post_id?: string | null
          social_profile_id?: string | null
          source_url?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_notion_page_id_fkey"
            columns: ["notion_page_id"]
            isOneToOne: false
            referencedRelation: "notion_pages"
            referencedColumns: ["notion_page_id"]
          },
          {
            foreignKeyName: "attachments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_social_profile_id_fkey"
            columns: ["social_profile_id"]
            isOneToOne: false
            referencedRelation: "social_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      client_scope_actuals: {
        Row: {
          client_id: string
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
      client_team_assignments: {
        Row: {
          account_manager: string | null
          account_manager_id: string | null
          client_id: string | null
          designer: string | null
          designer_id: string | null
          editor: string | null
          editor_id: string | null
          id: string
          social_lead: string | null
          social_lead_id: string | null
          social_media: string | null
          social_media_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_manager?: string | null
          account_manager_id?: string | null
          client_id?: string | null
          designer?: string | null
          designer_id?: string | null
          editor?: string | null
          editor_id?: string | null
          id?: string
          social_lead?: string | null
          social_lead_id?: string | null
          social_media?: string | null
          social_media_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_manager?: string | null
          account_manager_id?: string | null
          client_id?: string | null
          designer?: string | null
          designer_id?: string | null
          editor?: string | null
          editor_id?: string | null
          id?: string
          social_lead?: string | null
          social_lead_id?: string | null
          social_media?: string | null
          social_media_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_team_assignments_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_social_lead_id_fkey"
            columns: ["social_lead_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_social_lead_id_fkey"
            columns: ["social_lead_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_social_media_id_fkey"
            columns: ["social_media_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_team_assignments_social_media_id_fkey"
            columns: ["social_media_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
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
      external_supabase_connections: {
        Row: {
          anon_key_encrypted: string
          id: string
          is_enabled: boolean | null
          project_ref: string
          updated_at: string | null
          url: string
        }
        Insert: {
          anon_key_encrypted: string
          id?: string
          is_enabled?: boolean | null
          project_ref: string
          updated_at?: string | null
          url: string
        }
        Update: {
          anon_key_encrypted?: string
          id?: string
          is_enabled?: boolean | null
          project_ref?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      kpi_definitions: {
        Row: {
          config: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          source: string | null
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          source?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          source?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_entries: {
        Row: {
          created_at: string | null
          id: string
          kpi_id: string | null
          meta: Json | null
          recorded_at: string | null
          source: string | null
          source_key: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          meta?: Json | null
          recorded_at?: string | null
          source?: string | null
          source_key?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          meta?: Json | null
          recorded_at?: string | null
          source?: string | null
          source_key?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_entries_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
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
      notion_goal_kpis: {
        Row: {
          client_id: string | null
          current_value: string | null
          description: string | null
          id: string
          marcos: string | null
          meta_name: string | null
          notion_page_id: string
          period: string | null
          platforms: string[] | null
          raw_payload: Json | null
          status: string | null
          status_marcos: string | null
          synced_at: string | null
          target_value: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          current_value?: string | null
          description?: string | null
          id?: string
          marcos?: string | null
          meta_name?: string | null
          notion_page_id: string
          period?: string | null
          platforms?: string[] | null
          raw_payload?: Json | null
          status?: string | null
          status_marcos?: string | null
          synced_at?: string | null
          target_value?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          current_value?: string | null
          description?: string | null
          id?: string
          marcos?: string | null
          meta_name?: string | null
          notion_page_id?: string
          period?: string | null
          platforms?: string[] | null
          raw_payload?: Json | null
          status?: string | null
          status_marcos?: string | null
          synced_at?: string | null
          target_value?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notion_goal_kpis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_integrations: {
        Row: {
          clients_db_id: string | null
          created_at: string | null
          created_by: string | null
          encrypted_token: string
          goals_kpis_db_id: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          clients_db_id?: string | null
          created_at?: string | null
          created_by?: string | null
          encrypted_token: string
          goals_kpis_db_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          clients_db_id?: string | null
          created_at?: string | null
          created_by?: string | null
          encrypted_token?: string
          goals_kpis_db_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notion_integrations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_mappings: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          integration_id: string | null
          module: string
          notion_property: string
          target_field: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_id?: string | null
          module: string
          notion_property: string
          target_field: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          integration_id?: string | null
          module?: string
          notion_property?: string
          target_field?: string
        }
        Relationships: [
          {
            foreignKeyName: "notion_mappings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_pages: {
        Row: {
          created_at: string | null
          id: string
          integration_id: string | null
          module: string
          notion_page_id: string
          raw_payload: Json | null
          synced_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          module: string
          notion_page_id: string
          raw_payload?: Json | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_id?: string | null
          module?: string
          notion_page_id?: string
          raw_payload?: Json | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notion_pages_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      painel_de_conteudos: {
        Row: {
          cliente: string
          created_at: string | null
          data: string | null
          formato: string | null
          "id do conteúdo": string
          sm: string | null
          status: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data?: string | null
          formato?: string | null
          "id do conteúdo": string
          sm?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data?: string | null
          formato?: string | null
          "id do conteúdo"?: string
          sm?: string | null
          status?: string | null
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
      post_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          post_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          assigned_to: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notion_page_id: string | null
          preview_url: string | null
          scheduled_at: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notion_page_id?: string | null
          preview_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notion_page_id?: string | null
          preview_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_notion_page_id_fkey"
            columns: ["notion_page_id"]
            isOneToOne: false
            referencedRelation: "notion_pages"
            referencedColumns: ["notion_page_id"]
          },
        ]
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
      social_profiles: {
        Row: {
          created_at: string | null
          handle: string | null
          id: string
          last_synced_at: string | null
          metrics: Json | null
          notion_id: string | null
          platform: string | null
          status: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          handle?: string | null
          id?: string
          last_synced_at?: string | null
          metrics?: Json | null
          notion_id?: string | null
          platform?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          handle?: string | null
          id?: string
          last_synced_at?: string | null
          metrics?: Json | null
          notion_id?: string | null
          platform?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      source_mappings: {
        Row: {
          entity: string
          id: string
          mapping_json: Json
          source_type: string
          updated_at: string | null
        }
        Insert: {
          entity: string
          id?: string
          mapping_json?: Json
          source_type: string
          updated_at?: string | null
        }
        Update: {
          entity?: string
          id?: string
          mapping_json?: Json
          source_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_cursors: {
        Row: {
          created_at: string | null
          database_id: string
          error_count: number
          id: string
          integration_id: string
          is_locked: boolean
          last_error: string | null
          last_polled_at: string
          last_success_at: string | null
          locked_at: string | null
          module: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          database_id: string
          error_count?: number
          id?: string
          integration_id: string
          is_locked?: boolean
          last_error?: string | null
          last_polled_at?: string
          last_success_at?: string | null
          locked_at?: string | null
          module: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          database_id?: string
          error_count?: number
          id?: string
          integration_id?: string
          is_locked?: boolean
          last_error?: string | null
          last_polled_at?: string
          last_success_at?: string | null
          locked_at?: string | null
          module?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_cursors_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_clients: {
        Row: {
          client_id: string
          created_at: string
          id: string
          team_member_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          team_member_id: string
        }
        Update: {
          client_id?: string
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
          {
            foreignKeyName: "team_member_clients_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
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
            foreignKeyName: "team_members_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
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
      timeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          meta: Json | null
          notion_page_id: string | null
          owner: string | null
          start_date: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          meta?: Json | null
          notion_page_id?: string | null
          owner?: string | null
          start_date: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          meta?: Json | null
          notion_page_id?: string | null
          owner?: string | null
          start_date?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_notion_page_id_fkey"
            columns: ["notion_page_id"]
            isOneToOne: false
            referencedRelation: "notion_pages"
            referencedColumns: ["notion_page_id"]
          },
          {
            foreignKeyName: "timeline_events_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string | null
          id: string
          notion_project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notion_project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notion_project_id?: string
          user_id?: string
        }
        Relationships: []
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
      team_members_public: {
        Row: {
          area: Database["public"]["Enums"]["team_type"] | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
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
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          area?: Database["public"]["Enums"]["team_type"] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: never
          full_name?: string | null
          id?: string | null
          integration_id?: string | null
          leader_id?: string | null
          notion_id?: string | null
          phone?: never
          position?: string | null
          profile_id?: string | null
          role?: string | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          squad?: string | null
          start_date?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          area?: Database["public"]["Enums"]["team_type"] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: never
          full_name?: string | null
          id?: string | null
          integration_id?: string | null
          leader_id?: string | null
          notion_id?: string | null
          phone?: never
          position?: string | null
          profile_id?: string | null
          role?: string | null
          seniority?: Database["public"]["Enums"]["seniority_level"] | null
          squad?: string | null
          start_date?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "notion_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "team_members_public"
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
    }
    Functions: {
      _activity_insert: {
        Args: {
          _actor_id?: string
          _message?: string
          _payload: Json
          _project_id: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
      _notify_throttle_minutes: { Args: never; Returns: number }
      _notify_user: {
        Args: {
          _actor_id: string
          _payload: Json
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
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
      map_notion_to_kpi: {
        Args: { _mapped_fields: Json; _notion_page_id: string }
        Returns: {
          kpi_definition_id: string
          status: Database["public"]["Enums"]["upsert_status"]
        }[]
      }
      map_notion_to_post: {
        Args: {
          _created_by?: string
          _mapped_fields: Json
          _notion_page_id: string
        }
        Returns: {
          post_id: string
          status: Database["public"]["Enums"]["upsert_status"]
        }[]
      }
      map_notion_to_social_profile: {
        Args: { _mapped_fields: Json; _notion_page_id: string }
        Returns: {
          social_profile_id: string
          status: Database["public"]["Enums"]["upsert_status"]
        }[]
      }
      map_notion_to_team_member: {
        Args: { _mapped_fields: Json; _notion_page_id: string }
        Returns: {
          status: Database["public"]["Enums"]["upsert_status"]
          team_member_id: string
        }[]
      }
      map_notion_to_timeline: {
        Args: { _mapped_fields: Json; _notion_page_id: string }
        Returns: {
          status: Database["public"]["Enums"]["upsert_status"]
          timeline_event_id: string
        }[]
      }
      upsert_notion_page: {
        Args: {
          _integration_id: string
          _module: string
          _notion_page_id: string
          _raw_payload: Json
        }
        Returns: {
          id: string
          notion_page_id: string
          status: Database["public"]["Enums"]["upsert_status"]
          synced_at: string
        }[]
      }
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
      upsert_status: "created" | "updated" | "no_change"
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
      upsert_status: ["created", "updated", "no_change"],
    },
  },
} as const
