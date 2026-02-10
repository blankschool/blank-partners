

# Limpeza do Supabase - Remover Recursos Externos (mantendo painel_de_conteudos)

## O que sera MANTIDO

| Origem | Recursos |
|--------|----------|
| Minhas migrations | `positions`, `user_roles`, `profiles`, `notifications`, `team_members`, `clients`, `team_member_clients`, `client_scopes`, `client_scope_actuals`, `users` + enums, funcoes, storage `avatars` |
| Outra fonte (manter) | `painel_de_conteudos` (com trigger e funcao associada) |

## O que sera REMOVIDO

### Tabelas (18)
`activity_feed`, `attachments`, `audit_logs`, `client_team_assignments`, `external_supabase_connections`, `kpi_definitions`, `kpi_entries`, `notion_goal_kpis`, `notion_integrations`, `notion_mappings`, `notion_pages`, `post_comments`, `posts`, `social_profiles`, `source_mappings`, `sync_cursors`, `timeline_events`, `user_projects`

### Views (1)
`team_members_public`

### Enums (1)
`upsert_status`

### Funcoes (14 - mantendo update_painel_conteudos_updated_at e update_updated_at_column)
`_activity_insert`, `_notify_throttle_minutes`, `_notify_user`, `get_auth_user_id_by_email`, `handle_new_auth_user`, `map_notion_to_kpi`, `map_notion_to_post`, `map_notion_to_social_profile`, `map_notion_to_team_member`, `map_notion_to_timeline`, `trg_post_comments_after_insert`, `trg_posts_after_insert`, `trg_posts_after_update`, `upsert_notion_page`

### Storage Buckets (1)
`attachments`

## Migration SQL

```sql
-- 1. Triggers (apenas de tabelas que serao removidas)
DROP TRIGGER IF EXISTS post_comments_after_insert_activity_notify ON post_comments;
DROP TRIGGER IF EXISTS posts_after_insert_activity_notify ON posts;
DROP TRIGGER IF EXISTS posts_after_update_activity_notify ON posts;

-- 2. Views
DROP VIEW IF EXISTS team_members_public;

-- 3. Tabelas (ordem segura)
DROP TABLE IF EXISTS kpi_entries CASCADE;
DROP TABLE IF EXISTS notion_goal_kpis CASCADE;
DROP TABLE IF EXISTS notion_mappings CASCADE;
DROP TABLE IF EXISTS sync_cursors CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS notion_pages CASCADE;
DROP TABLE IF EXISTS notion_integrations CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS client_team_assignments CASCADE;
DROP TABLE IF EXISTS external_supabase_connections CASCADE;
DROP TABLE IF EXISTS kpi_definitions CASCADE;
DROP TABLE IF EXISTS social_profiles CASCADE;
DROP TABLE IF EXISTS source_mappings CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS user_projects CASCADE;

-- 4. Funcoes (NAO remove update_painel_conteudos_updated_at nem update_updated_at_column)
DROP FUNCTION IF EXISTS _activity_insert;
DROP FUNCTION IF EXISTS _notify_throttle_minutes;
DROP FUNCTION IF EXISTS _notify_user;
DROP FUNCTION IF EXISTS get_auth_user_id_by_email;
DROP FUNCTION IF EXISTS handle_new_auth_user;
DROP FUNCTION IF EXISTS map_notion_to_kpi;
DROP FUNCTION IF EXISTS map_notion_to_post;
DROP FUNCTION IF EXISTS map_notion_to_social_profile;
DROP FUNCTION IF EXISTS map_notion_to_team_member;
DROP FUNCTION IF EXISTS map_notion_to_timeline;
DROP FUNCTION IF EXISTS trg_post_comments_after_insert;
DROP FUNCTION IF EXISTS trg_posts_after_insert;
DROP FUNCTION IF EXISTS trg_posts_after_update;
DROP FUNCTION IF EXISTS upsert_notion_page;

-- 5. Enums
DROP TYPE IF EXISTS upsert_status;

-- 6. Storage
DELETE FROM storage.objects WHERE bucket_id = 'attachments';
DELETE FROM storage.buckets WHERE id = 'attachments';
```

## Resultado

O Supabase ficara com:
- Todas as tabelas das minhas migrations + `painel_de_conteudos`
- Funcoes e triggers da `painel_de_conteudos` preservados
- Tudo mais removido

