

# Página de Controle de Escopo (Atualizado)

## Ajuste Solicitado

Separar o YouTube em duas categorias distintas:
- **YouTube Shorts** - Vídeos curtos verticais
- **YouTube Videos** - Vídeos longos tradicionais

## Implementação

### 1. Migração do Banco de Dados

#### Tabela client_scopes (alterar estrutura existente)

```sql
-- Renomear coluna existente e adicionar nova
ALTER TABLE client_scopes 
  RENAME COLUMN youtube TO youtube_shorts;

ALTER TABLE client_scopes 
  ADD COLUMN youtube_videos integer DEFAULT 0;
```

#### Nova tabela client_scope_actuals

```sql
CREATE TABLE client_scope_actuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  month date NOT NULL,
  instagram integer DEFAULT 0,
  tiktok_posts integer DEFAULT 0,
  linkedin_posts integer DEFAULT 0,
  youtube_shorts integer DEFAULT 0,
  youtube_videos integer DEFAULT 0,
  recordings integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, month)
);

-- RLS Policies
ALTER TABLE client_scope_actuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scope actuals"
  ON client_scope_actuals FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert scope actuals"
  ON client_scope_actuals FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update scope actuals"
  ON client_scope_actuals FOR UPDATE TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete scope actuals"
  ON client_scope_actuals FOR DELETE TO authenticated
  USING (is_admin());
```

### 2. Atualizar Componentes Existentes

#### ClientScopeInput.tsx

Alterar de:
```text
YouTube (1 campo)
```

Para:
```text
YouTube Shorts | YouTube Videos (2 campos lado a lado)
```

#### ClientsTab.tsx

Na tabela de clientes, substituir a coluna única de YouTube por duas:
- Coluna YT Shorts (ícone YouTube com "S")
- Coluna YT Videos (ícone YouTube com "V")

#### useClients.tsx

Atualizar interface `ClientScope`:
- Remover `youtube`
- Adicionar `youtube_shorts` e `youtube_videos`

Atualizar `ClientScopeData`:
- Remover `youtube`
- Adicionar `youtube_shorts` e `youtube_videos`

### 3. Criar Página de Controle de Escopo

#### Estrutura da Tabela

```text
| Cliente | IG Plan | IG Real | TT Plan | TT Real | LI Plan | LI Real | YTS Plan | YTS Real | YTV Plan | YTV Real | Grav Plan | Grav Real |
```

Legenda:
- **IG** = Instagram
- **TT** = TikTok
- **LI** = LinkedIn
- **YTS** = YouTube Shorts
- **YTV** = YouTube Videos
- **Grav** = Gravações

#### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/ScopeControl.tsx` | Página principal com seletor de mês |
| `src/hooks/useScopeControl.tsx` | Hook para buscar e atualizar dados |
| `src/components/scope/ScopeControlTable.tsx` | Tabela editável com inputs |
| `src/components/scope/ScopeMonthSelector.tsx` | Seletor de período |

#### Navegação

Adicionar ao AppSidebar:
- Ícone: Target
- Label: "Controle de Escopo"
- Rota: `/scope-control`

### 4. Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| Migração SQL | Alterar `client_scopes` + criar `client_scope_actuals` |
| `src/components/admin/ClientScopeInput.tsx` | Separar YouTube em 2 campos |
| `src/components/admin/ClientsTab.tsx` | Adicionar 2 colunas de YouTube |
| `src/hooks/useClients.tsx` | Atualizar interfaces e queries |
| `src/pages/ScopeControl.tsx` | Criar página |
| `src/hooks/useScopeControl.tsx` | Criar hook |
| `src/components/scope/ScopeControlTable.tsx` | Criar componente |
| `src/components/scope/ScopeMonthSelector.tsx` | Criar componente |
| `src/App.tsx` | Adicionar rota |
| `src/components/layout/AppSidebar.tsx` | Adicionar link no menu |

### 5. Visualização do Input de Escopo (Atualizado)

```text
┌─────────────────────────────────────────────┐
│         Escopo de Entregas                  │
├─────────────────────────────────────────────┤
│  Instagram        │  TikTok                 │
│  Conteúdos: [___] │  Posts: [___]           │
├─────────────────────────────────────────────┤
│  LinkedIn         │  YouTube Shorts         │
│  Posts: [___]     │  Conteúdos: [___]       │
├─────────────────────────────────────────────┤
│  YouTube Videos   │  Gravações              │
│  Conteúdos: [___] │  Quantidade: [___]      │
└─────────────────────────────────────────────┘
```

### 6. Colunas da Tabela de Clientes (Atualizado)

```text
| Avatar | Cliente | Status | Início | Membros | IG | TT | LI | YTS | YTV | Grav | SM | Editor | Designer | Ações |
```

