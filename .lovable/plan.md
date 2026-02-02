
# Simplificar Escopo de Clientes

## Alterações Solicitadas

1. **Instagram**: Remover divisão (Posts, Reels, Stories) → Um único campo "Conteúdos"
2. **YouTube**: Remover divisão (Vídeos, Shorts) → Um único campo "Conteúdos"  
3. **Gravações**: Verificar se está aparecendo corretamente (o código já tem, pode ser problema de scroll)

## Solução

Simplificar tanto o banco de dados quanto a interface, consolidando os campos.

## Estrutura Simplificada

### Antes (Atual)
| Campo | Descrição |
|-------|-----------|
| instagram_posts | Posts do Instagram |
| instagram_reels | Reels do Instagram |
| instagram_stories | Stories do Instagram |
| youtube_videos | Vídeos do YouTube |
| youtube_shorts | Shorts do YouTube |

### Depois (Simplificado)
| Campo | Descrição |
|-------|-----------|
| instagram | Total de conteúdos Instagram |
| youtube | Total de conteúdos YouTube |

## Layout da Interface Simplificada

```text
┌─────────────────────────────────────────────────────────┐
│ Editar Cliente                                          │
├─────────────────────────────────────────────────────────┤
│ Nome do Cliente: [Ale Frankel________________]          │
│                                                         │
│ ─── Escopo de Entregas ─────────────────────────────── │
│                                                         │
│ 📸 Instagram                TikTok 🎵                   │
│    Conteúdos: [__]            Posts: [__]              │
│                                                         │
│ 💼 LinkedIn                 YouTube 🎬                  │
│    Posts: [__]                Conteúdos: [__]          │
│                                                         │
│ 🎥 Gravações                                            │
│    Quantidade: [__]                                     │
│                                                         │
│                        [Cancelar]  [Salvar]             │
└─────────────────────────────────────────────────────────┘
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `supabase/migrations/` | Nova migração para consolidar colunas |
| `src/integrations/supabase/types.ts` | Atualizar tipos gerados |
| `src/components/admin/ClientScopeInput.tsx` | Simplificar para campos únicos |
| `src/hooks/useClients.tsx` | Atualizar interface ClientScopeData |
| `src/components/admin/EditClientDialog.tsx` | Ajustar mapeamento de escopo |
| `src/components/admin/ClientsTab.tsx` | Atualizar resumo do escopo |

## Migração SQL

```sql
-- Consolidar campos do Instagram
ALTER TABLE public.client_scopes 
  ADD COLUMN instagram integer DEFAULT 0;

UPDATE public.client_scopes 
SET instagram = COALESCE(instagram_posts, 0) + COALESCE(instagram_reels, 0) + COALESCE(instagram_stories, 0);

ALTER TABLE public.client_scopes 
  DROP COLUMN instagram_posts,
  DROP COLUMN instagram_reels,
  DROP COLUMN instagram_stories;

-- Consolidar campos do YouTube
ALTER TABLE public.client_scopes 
  ADD COLUMN youtube integer DEFAULT 0;

UPDATE public.client_scopes 
SET youtube = COALESCE(youtube_videos, 0) + COALESCE(youtube_shorts, 0);

ALTER TABLE public.client_scopes 
  DROP COLUMN youtube_videos,
  DROP COLUMN youtube_shorts;
```

## Nova Interface TypeScript

```typescript
export interface ClientScopeData {
  instagram: number;      // Consolidado (era posts + reels + stories)
  tiktok_posts: number;   // Mantém igual
  linkedin_posts: number; // Mantém igual
  youtube: number;        // Consolidado (era videos + shorts)
  recordings: number;     // Mantém igual
}
```

## Componente Simplificado

O novo `ClientScopeInput` terá layout mais compacto:

- **Linha 1**: Instagram + TikTok (lado a lado)
- **Linha 2**: LinkedIn + YouTube (lado a lado)
- **Linha 3**: Gravações (largura total)

## Benefícios

1. Interface mais limpa e objetiva
2. Menos campos para preencher
3. Redução de complexidade no banco de dados
4. Mantém as redes sociais essenciais (Instagram, TikTok, LinkedIn, YouTube) + Gravações
