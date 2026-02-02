

# Adicionar Filtros na Página de Clientes

## Objetivo

Adicionar dois novos filtros à página de Clientes:
1. **Filtro por Pessoa** - Filtrar clientes por membro da equipe associado
2. **Filtro por Alocação de Social Media** - Mostrar clientes com ou sem Social Media alocado

## Análise Técnica

### Dados Disponíveis

Os clientes já possuem a lista de membros associados (`members`) através do hook `useClients`:
- `client.members` → Array de `{id, full_name}`
- `client.member_count` → Número total de membros

Os membros da equipe têm uma propriedade `area` que identifica se são "Social Media".

### Lógica do Filtro de Social Media

Um cliente **tem Social Media alocado** quando pelo menos um de seus membros pertence à área "Social Media". Para isso, será necessário:

1. Buscar informações de área dos team_members
2. Verificar se algum membro do cliente é da área "Social Media"

## Implementação

### Arquivos a Criar

1. **`src/components/clients/ClientFilters.tsx`** - Componente de filtros seguindo o padrão de `TeamFilters.tsx`

### Arquivos a Modificar

1. **`src/hooks/useClients.tsx`** - Incluir a área do membro na estrutura de dados
2. **`src/pages/Clients.tsx`** - Adicionar os estados de filtro e lógica de filtragem

### Estrutura do Componente ClientFilters

```text
┌─────────────────────────────────────────────────────────────────────┐
│  [🔍 Buscar clientes...]  [Pessoa ▼]  [Alocação SM ▼]               │
└─────────────────────────────────────────────────────────────────────┘
```

### Opções dos Filtros

**Filtro "Pessoa":**
- Todos os responsáveis (default)
- Lista de membros únicos que estão alocados em algum cliente

**Filtro "Alocação SM":**
- Todos
- Com Social Media
- Sem Social Media

## Detalhes Técnicos

### Passo 1: Atualizar useClients.tsx

Adicionar a propriedade `area` à interface `TeamMemberInfo`:

```typescript
interface TeamMemberInfo {
  id: string;
  full_name: string;
  area: string | null;  // Nova propriedade
}
```

Buscar a área do membro na query:

```typescript
const { data: assignments } = await supabase
  .from("team_member_clients")
  .select(`
    client_id,
    team_members (
      id,
      full_name,
      area
    )
  `);
```

### Passo 2: Criar ClientFilters.tsx

Componente que recebe:
- `searchQuery` / `onSearchChange`
- `selectedMember` / `onMemberChange` 
- `selectedAllocation` / `onAllocationChange`
- `members` - Lista de membros únicos para o dropdown

### Passo 3: Atualizar Clients.tsx

Adicionar estados:
- `selectedMember: string` → "all" ou ID do membro
- `selectedAllocation: string` → "all" | "with-sm" | "without-sm"

Adicionar lógica de filtragem:

```typescript
const filteredClients = useMemo(() => {
  return clients?.filter((client) => {
    // Filtro de busca (existente)
    if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filtro por pessoa
    if (selectedMember !== "all") {
      if (!client.members.some(m => m.id === selectedMember)) {
        return false;
      }
    }

    // Filtro por alocação de SM
    if (selectedAllocation !== "all") {
      const hasSocialMedia = client.members.some(m => m.area === "Social Media");
      if (selectedAllocation === "with-sm" && !hasSocialMedia) return false;
      if (selectedAllocation === "without-sm" && hasSocialMedia) return false;
    }

    return true;
  }) || [];
}, [clients, searchQuery, selectedMember, selectedAllocation]);
```

## Resultado Visual

A seção de filtros ficará assim:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [🔍 Buscar clientes...]   [Responsável ▼]   [Alocação SM ▼]   [+ Adicionar Cliente]
└──────────────────────────────────────────────────────────────────────────┘
```

Os cards de estatísticas e a lista de clientes serão atualizados conforme os filtros aplicados.

