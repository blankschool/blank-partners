

# Adicionar Coluna de Status de Clientes

## Objetivo

Adicionar uma coluna de status na tabela de clientes do Admin para rastrear a etapa do ciclo de vida de cada cliente.

## Etapas de Status

1. Kickoff
2. Diagnóstico
3. Apresentação de planejamento
4. 30D
5. 60D
6. 90D
7. Ongoing
8. Cancelado

## Implementação

### Passo 1: Migração do Banco de Dados

Criar um enum type e adicionar coluna `status` na tabela `clients`:

```sql
-- Criar enum type para status do cliente
CREATE TYPE client_status AS ENUM (
  'kickoff',
  'diagnostico',
  'apresentacao_planejamento',
  '30d',
  '60d',
  '90d',
  'ongoing',
  'cancelado'
);

-- Adicionar coluna status na tabela clients
ALTER TABLE clients 
ADD COLUMN status client_status DEFAULT 'kickoff';
```

### Passo 2: Criar Configuração de Status

Criar arquivo `src/lib/clientStatus.ts` com as definições de status e cores:

| Status | Label | Cor |
|--------|-------|-----|
| kickoff | Kickoff | Azul |
| diagnostico | Diagnóstico | Laranja |
| apresentacao_planejamento | Apresentação de planejamento | Roxo |
| 30d | 30D | Amarelo |
| 60d | 60D | Amarelo |
| 90d | 90D | Amarelo |
| ongoing | Ongoing | Verde |
| cancelado | Cancelado | Vermelho |

### Passo 3: Atualizar Hook useClients

Modificar `src/hooks/useClients.tsx`:
- Adicionar `status` à interface `ClientWithStats`
- Buscar `status` na query de clientes
- Incluir `status` nas mutations de create e update

### Passo 4: Atualizar ClientsTab

Modificar `src/components/admin/ClientsTab.tsx`:
- Adicionar coluna "Status" no header da tabela
- Exibir badge colorido com o status do cliente
- Posicionar após a coluna "Cliente"

### Passo 5: Atualizar Dialogs

Modificar `src/components/admin/AddClientDialog.tsx` e `EditClientDialog.tsx`:
- Adicionar Select para escolher o status
- Incluir status nos handlers de save

## Layout Final da Tabela

```text
| Avatar | Cliente | Status | Membros | IG | TT | LI | YT | Grav | SM | Editor | Designer | Ações |
```

## Visualização do Status

Cada status terá um indicador visual com ponto colorido + texto, seguindo o padrão existente no projeto:

```text
● Kickoff        (azul)
● Diagnóstico    (laranja)
● Apresentação   (roxo)
● 30D / 60D / 90D (amarelo)
● Ongoing        (verde)
● Cancelado      (vermelho)
```

## Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| Migração SQL | Criar enum e adicionar coluna |
| `src/lib/clientStatus.ts` | Criar configuração de status |
| `src/hooks/useClients.tsx` | Adicionar status na interface e queries |
| `src/components/admin/ClientsTab.tsx` | Adicionar coluna de status na tabela |
| `src/components/admin/AddClientDialog.tsx` | Adicionar seletor de status |
| `src/components/admin/EditClientDialog.tsx` | Adicionar seletor de status |

