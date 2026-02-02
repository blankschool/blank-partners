

# Adicionar Coluna de Data de Início de Contrato

## Objetivo

Adicionar uma coluna "Início" na tabela de clientes do Admin para exibir a data de início do contrato de cada cliente.

## Implementação

### Passo 1: Migração do Banco de Dados

Adicionar coluna `contract_start_date` na tabela `clients`:

```sql
ALTER TABLE clients 
ADD COLUMN contract_start_date date;
```

### Passo 2: Atualizar Hook useClients

Modificar `src/hooks/useClients.tsx`:
- Adicionar `contract_start_date` à interface `ClientWithStats`
- Incluir `contract_start_date` na query de clientes
- Incluir `contract_start_date` nas mutations de create e update

### Passo 3: Atualizar ClientsTab

Modificar `src/components/admin/ClientsTab.tsx`:
- Adicionar ícone `Calendar` do lucide-react
- Adicionar coluna "Início" no header da tabela (após Status)
- Exibir a data formatada (DD/MM/YYYY) na linha de cada cliente

### Passo 4: Atualizar Dialogs

Modificar `src/components/admin/AddClientDialog.tsx` e `EditClientDialog.tsx`:
- Importar componente de seleção de data (Popover + Calendar)
- Adicionar campo de data de início de contrato
- Incluir data nos handlers de save

## Layout Final da Tabela

```text
| Avatar | Cliente | Status | Início | Membros | IG | TT | LI | YT | Grav | SM | Editor | Designer | Ações |
```

## Visualização da Data

A data será exibida no formato brasileiro `DD/MM/YYYY`:

```text
01/01/2024
15/03/2024
—  (se não preenchida)
```

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| Migração SQL | Adicionar coluna `contract_start_date` |
| `src/hooks/useClients.tsx` | Adicionar campo na interface e queries |
| `src/components/admin/ClientsTab.tsx` | Adicionar coluna na tabela |
| `src/components/admin/AddClientDialog.tsx` | Adicionar seletor de data |
| `src/components/admin/EditClientDialog.tsx` | Adicionar seletor de data |

