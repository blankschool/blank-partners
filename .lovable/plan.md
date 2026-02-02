
# Adicionar Escopo de Clientes

## Problema

Atualmente, os clientes só possuem o campo "nome". Você precisa registrar o escopo de entregas de cada cliente, incluindo:
1. **Quantidade de conteúdos por rede social** (Instagram, TikTok, LinkedIn, YouTube, etc.)
2. **Gravações por cliente** (número de gravações contratadas)

## Solução

Criar uma nova tabela `client_scopes` para armazenar o escopo de cada cliente, permitindo definir quantidades por rede social e o número de gravações.

## Estrutura do Banco de Dados

### Nova Tabela: `client_scopes`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | uuid | Chave primária |
| client_id | uuid | FK para clients |
| instagram_posts | integer | Qtd de posts no Instagram |
| instagram_reels | integer | Qtd de reels no Instagram |
| instagram_stories | integer | Qtd de stories no Instagram |
| tiktok_posts | integer | Qtd de posts no TikTok |
| linkedin_posts | integer | Qtd de posts no LinkedIn |
| youtube_videos | integer | Qtd de vídeos no YouTube |
| youtube_shorts | integer | Qtd de shorts no YouTube |
| recordings | integer | Qtd de gravações |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

### Por que uma tabela separada?

- Permite adicionar novas redes sociais sem alterar a tabela principal
- Mantém histórico de alterações
- Separação de responsabilidades (dados do cliente vs escopo)

## Alterações de Interface

### 1. Dialog de Adicionar/Editar Cliente

Expandir os dialogs para incluir uma seção "Escopo de Entregas":

```text
┌─────────────────────────────────────────────────────────┐
│ Adicionar Cliente                                       │
├─────────────────────────────────────────────────────────┤
│ Nome do Cliente: [________________________]             │
│                                                         │
│ ─── Escopo de Entregas ───────────────────────────────  │
│                                                         │
│ 📸 Instagram                                            │
│   Posts: [__]    Reels: [__]    Stories: [__]          │
│                                                         │
│ 🎵 TikTok                                               │
│   Posts: [__]                                           │
│                                                         │
│ 💼 LinkedIn                                             │
│   Posts: [__]                                           │
│                                                         │
│ 🎬 YouTube                                              │
│   Vídeos: [__]    Shorts: [__]                         │
│                                                         │
│ 🎥 Gravações                                            │
│   Quantidade: [__]                                      │
│                                                         │
│                        [Cancelar]  [Adicionar]          │
└─────────────────────────────────────────────────────────┘
```

### 2. Lista de Clientes

Adicionar coluna de escopo resumido na lista:

```text
│ Cliente        │ Membros │ Escopo                    │ Ações │
├────────────────┼─────────┼───────────────────────────┼───────┤
│ [AV] A Grande  │ 3       │ IG: 12 | TT: 8 | Grav: 2  │ [✎]🗑 │
```

## Arquivos a Modificar/Criar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/migrations/` | Criar | Migração para tabela `client_scopes` |
| `src/hooks/useClients.tsx` | Modificar | Buscar e salvar dados de escopo |
| `src/components/admin/AddClientDialog.tsx` | Modificar | Adicionar campos de escopo |
| `src/components/admin/EditClientDialog.tsx` | Modificar | Adicionar campos de escopo |
| `src/components/admin/ClientsTab.tsx` | Modificar | Exibir resumo do escopo na lista |

## Detalhes Técnicos

### Migração SQL

```sql
CREATE TABLE client_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  instagram_posts integer DEFAULT 0,
  instagram_reels integer DEFAULT 0,
  instagram_stories integer DEFAULT 0,
  tiktok_posts integer DEFAULT 0,
  linkedin_posts integer DEFAULT 0,
  youtube_videos integer DEFAULT 0,
  youtube_shorts integer DEFAULT 0,
  recordings integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(client_id)
);

-- RLS policies
ALTER TABLE client_scopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view client scopes"
  ON client_scopes FOR SELECT USING (true);

CREATE POLICY "Admins can insert client scopes"
  ON client_scopes FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update client scopes"
  ON client_scopes FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete client scopes"
  ON client_scopes FOR DELETE USING (is_admin());
```

### Interface TypeScript

```typescript
interface ClientScope {
  id: string;
  client_id: string;
  instagram_posts: number;
  instagram_reels: number;
  instagram_stories: number;
  tiktok_posts: number;
  linkedin_posts: number;
  youtube_videos: number;
  youtube_shorts: number;
  recordings: number;
}

interface ClientWithStats {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  members: TeamMemberInfo[];
  scope?: ClientScope; // Novo campo
}
```

### Componente de Input de Escopo

Criar um componente reutilizável para os campos de escopo com:
- Agrupamento visual por rede social
- Inputs numéricos com valor mínimo 0
- Ícones para identificação rápida

## Benefícios

1. **Visibilidade**: Ver o escopo de cada cliente rapidamente na lista
2. **Organização**: Dados estruturados por rede social
3. **Escalabilidade**: Fácil adicionar novas redes sociais no futuro
4. **Controle**: Acompanhar entregas contratadas vs realizadas
