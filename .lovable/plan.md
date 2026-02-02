

# Adicionar Colunas de Equipe na Tabela de Clientes (Admin)

## Objetivo

Substituir a coluna genérica "Responsáveis" por três colunas específicas:
1. **Social Media** - Membro responsável pelo Social Media do cliente
2. **Editor** - Membro responsável pela edição de vídeo
3. **Designer** - Membro responsável pelo design

## Análise Técnica

### Dados Atuais

O hook `useClients` já busca os membros de cada cliente, mas apenas com `area`. Para identificar o cargo específico, é necessário também buscar o campo `position` de cada membro.

Cargos relevantes no banco:
- **Social Media**: `Social Media`, `Líder de Social Media`, `Coordenador de Social Media`
- **Editor**: `Editor de Vídeos`
- **Designer**: `Designer`, `Líder de Design`

### Lógica de Exibição

Para cada cliente, mostrar o **primeiro nome** do membro que ocupa cada função:
- Se não houver ninguém atribuído, mostrar "—"
- Priorizar cargos "base" sobre líderes/coordenadores (opcional)

## Implementação

### Arquivos a Modificar

1. **`src/hooks/useClients.tsx`** - Adicionar `position` ao `TeamMemberInfo`
2. **`src/components/admin/ClientsTab.tsx`** - Reorganizar colunas da tabela

### Passo 1: Atualizar useClients.tsx

Adicionar o campo `position` à interface e à query:

```typescript
interface TeamMemberInfo {
  id: string;
  full_name: string;
  area: string | null;
  position: string | null;  // Novo campo
}
```

Atualizar a query para incluir `position`:

```typescript
.select(`
  client_id,
  team_members (
    id,
    full_name,
    area,
    position
  )
`)
```

### Passo 2: Atualizar ClientsTab.tsx

Criar helper functions para extrair membros por cargo:

```typescript
const getMemberByPosition = (members: TeamMemberInfo[], positions: string[]) => {
  const member = members.find(m => 
    m.position && positions.includes(m.position)
  );
  return member ? member.full_name.split(" ")[0] : null;
};

const getSocialMedia = (members: TeamMemberInfo[]) => 
  getMemberByPosition(members, ["Social Media", "Líder de Social Media", "Coordenador de Social Media"]);

const getEditor = (members: TeamMemberInfo[]) => 
  getMemberByPosition(members, ["Editor de Vídeos"]);

const getDesigner = (members: TeamMemberInfo[]) => 
  getMemberByPosition(members, ["Designer", "Líder de Design"]);
```

Reorganizar as colunas da tabela:

```text
| Avatar | Cliente | Membros | Escopo | SM | Editor | Designer | Ações |
```

### Nova Estrutura do Header

```typescript
<span className="w-8"></span>           {/* Avatar */}
<span className="flex-1 min-w-0">Cliente</span>
<span className="w-20 text-center">Membros</span>
<span className="w-44 hidden lg:block">Escopo</span>
<span className="w-24 hidden md:block">SM</span>
<span className="w-24 hidden md:block">Editor</span>
<span className="w-24 hidden md:block">Designer</span>
<span className="w-20 text-right">Ações</span>
```

### Nova Estrutura das Linhas

Para cada cliente, exibir:
- Nome do Social Media (primeiro nome apenas)
- Nome do Editor de Vídeo (primeiro nome apenas)
- Nome do Designer (primeiro nome apenas)

Se o campo estiver vazio, mostrar "—" em cor mais suave.

## Resultado Visual

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│     │ Cliente        │ Membros │ Escopo              │ SM      │ Editor  │ Designer │ Ações │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ RB  │ Reinaldo Boess │    3    │ IG: 30              │ Giovana │ Luiz    │ Henrique │ ⋮     │
│ SC  │ Sandra Chayo   │    2    │ IG: 30              │ Maria   │ Daniel  │ —        │ ⋮     │
│ FM  │ Fábio Müller   │    3    │ IG: 12 | LI: 8      │ Paulo   │ Willian │ Lucas    │ ⋮     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useClients.tsx` | Adicionar `position` ao `TeamMemberInfo` e à query Supabase |
| `src/components/admin/ClientsTab.tsx` | Substituir coluna "Responsáveis" por 3 colunas: SM, Editor, Designer |

