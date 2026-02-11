

# Vincular Relatorio a Reuniao

## Resumo

Adicionar a possibilidade de vincular um relatorio existente (da pagina de Relatorios) a uma reuniao. O usuario podera selecionar um relatorio do mesmo cliente em um dropdown dentro do pop-up da reuniao.

## Mudancas

### 1. Migracao: Adicionar coluna `report_id` na tabela `client_meetings`

Adicionar uma coluna opcional `report_id` (uuid, nullable) que referencia a tabela `client_reports`.

```text
ALTER TABLE client_meetings ADD COLUMN report_id uuid REFERENCES client_reports(id) ON DELETE SET NULL;
```

Quando o relatorio vinculado for deletado, o campo sera limpo automaticamente (`SET NULL`).

### 2. `src/components/meetings/MeetingLinkDialog.tsx`

- Adicionar um campo **"Relatorio vinculado"** com um `Select` dropdown
- O dropdown lista os relatorios do mesmo cliente (buscados via props)
- Opcao "Nenhum" para desvincular
- Ao selecionar um relatorio, mostra o titulo e um botao para abrir o link do relatorio
- Atualizar a interface `onSave` para incluir `report_id`

### 3. `src/hooks/useMeetings.tsx`

- Adicionar `report_id` ao `Meeting` interface e ao `UpsertMeetingInput`
- Incluir `report_id` no insert e update do Supabase
- Na query, fazer join com `client_reports` para trazer o titulo do relatorio vinculado

### 4. `src/components/meetings/MeetingTrackingTable.tsx`

- Passar a lista de relatorios do mes para o dialog
- Atualizar o `onSave` callback para incluir `report_id`
- Passar `initialReportId` para o dialog

### 5. `src/pages/Meetings.tsx`

- Buscar os relatorios do mes selecionado (reutilizar `useReports` ja existente)
- Passar a lista de relatorios para o `MeetingTrackingTable`
- Atualizar o handler `onUpsert` para incluir `report_id`

## Fluxo do Usuario

1. Usuario clica em uma celula na tabela de reunioes
2. Pop-up abre com os campos atuais + novo campo "Relatorio vinculado"
3. O dropdown mostra todos os relatorios do mesmo cliente no mes
4. Usuario seleciona o relatorio desejado e salva
5. A vinculacao fica salva no banco

## Detalhes Tecnicos

- A coluna `report_id` e nullable para permitir reunioes sem relatorio vinculado
- O `ON DELETE SET NULL` garante que se o relatorio for removido, a reuniao nao quebra
- Os relatorios serao filtrados por `client_id` no dropdown para mostrar apenas os do mesmo cliente
- O hook `useReports` ja existente sera reutilizado na pagina de Meetings para buscar os relatorios disponiveis

