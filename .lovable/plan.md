

# Calendario de Reunioes

## Objetivo

Criar uma pagina de acompanhamento de reunioes (semanais e mensais) para todos os clientes, seguindo o mesmo layout e logica da pagina de Relatorios. A tabela `client_meetings` ja existe no Supabase com as colunas necessarias.

## Estrutura da Pagina

A pagina tera o mesmo layout da pagina de Relatorios:
- Seletor de mes no topo
- Tabela com clientes nas linhas e semanas + coluna mensal nas colunas
- Celulas clicaveis para adicionar/editar link da reuniao
- Indicador visual (check verde = reuniao agendada, tracinho = pendente)

## Mudancas

### 1. Migracao: Adicionar coluna `meeting_period` na tabela `client_meetings`

A tabela atual nao tem como diferenciar reunioes semanais de mensais. Sera adicionada uma coluna `meeting_period` (text) e uma constraint unique em `(client_id, meeting_period, meeting_date)` para evitar duplicatas, similar ao que `client_reports` faz com `report_period` e `reference_date`.

```text
ALTER TABLE client_meetings ADD COLUMN meeting_period text;
-- Unique constraint para evitar duplicatas
ALTER TABLE client_meetings ADD CONSTRAINT client_meetings_unique_period 
  UNIQUE (client_id, meeting_period, meeting_date);
```

### 2. Hook: `src/hooks/useMeetings.tsx`

Novo hook seguindo o padrao de `useReports.tsx`:
- Query que busca reunioes do mes selecionado filtrando por `meeting_date`
- Mutation `upsertMeeting` que verifica existencia antes de inserir/atualizar
- Mutation `deleteMeeting` para remover reunioes

### 3. Componentes de Reunioes

| Arquivo | Descricao |
|---|---|
| `src/components/meetings/MeetingCell.tsx` | Celula visual (check/tracinho), mesmo padrao do `ReportCell` |
| `src/components/meetings/MeetingLinkDialog.tsx` | Dialog para adicionar/editar link + titulo da reuniao, mesmo padrao do `ReportLinkDialog` |
| `src/components/meetings/MeetingTrackingTable.tsx` | Tabela com clientes x semanas + mensal, mesmo padrao do `ReportTrackingTable` |

### 4. Pagina: `src/pages/Meetings.tsx`

Nova pagina seguindo o padrao exato de `Reports.tsx`:
- Icone de calendario no header
- `ReportMonthSelector` reutilizado para navegacao de mes
- `MeetingTrackingTable` com a mesma logica de semanas

### 5. Rota e Sidebar

- Adicionar rota `/meetings` em `App.tsx` protegida por `AgencyRoute` (mesma permissao de Relatorios)
- Adicionar item "Reunioes" na sidebar em `agencyNavigationItems` com icone `Calendar`

### 6. Sem mudancas em RLS

As policies da tabela `client_meetings` ja permitem ALL para `is_admin_or_agency()` e SELECT para clientes que sao donos. Nenhuma alteracao necessaria.

## Detalhes Tecnicos

- A `meeting_date` sera usada como `reference_date` (primeira segunda da semana ou dia 1 do mes)
- O `meeting_link` armazena o link da reuniao (Google Meet, Zoom, etc.)
- O `meeting_period` sera "weekly" ou "monthly", mesmo padrao dos relatorios
- O componente `ReportMonthSelector` sera reutilizado pois e generico
