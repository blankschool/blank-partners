

# Revisar Pop-up de Reunioes

## Resumo

O dialog atual so tem 2 campos (Link e Titulo). A tabela `client_meetings` ja possui colunas para `description` e `meeting_date` que nao estao sendo usadas no formulario. Vamos adicionar esses campos ao pop-up para capturar todas as informacoes relevantes.

## Campos do Pop-up Revisado

| Campo | Tipo | Obrigatorio | Situacao Atual |
|---|---|---|---|
| Cliente | Texto (somente leitura) | -- | Ja aparece no header |
| Periodo | Texto (somente leitura) | -- | Ja aparece no header |
| Titulo | Input texto | Sim | Existe, mas era opcional. Passa a ser obrigatorio |
| Descricao | Textarea | Nao | Novo campo |
| Data da Reuniao | Input date | Nao | Novo campo (pre-preenchido com a data de referencia) |
| Link da Reuniao | Input url | Nao | Ja existe, passa a ser opcional |

## Mudancas

### 1. `src/components/meetings/MeetingLinkDialog.tsx`

- Adicionar campo **Descricao** (textarea) para observacoes sobre a reuniao
- Adicionar campo **Data da Reuniao** (input date) pre-preenchido com a data de referencia da celula clicada, permitindo ajuste manual
- Tornar **Titulo** obrigatorio (era opcional)
- Tornar **Link** opcional (era obrigatorio) -- nem toda reuniao tem link no momento do cadastro
- Atualizar a interface `onSave` para incluir `description` e `meeting_date`
- Renomear o componente conceitualmente de "link dialog" para um formulario mais completo

### 2. `src/hooks/useMeetings.tsx`

- Adicionar `description` e `meeting_date` ao `UpsertMeetingInput`
- Incluir `description` no insert e update do Supabase
- Permitir que `meeting_link` seja string vazia (opcional)

### 3. `src/components/meetings/MeetingTrackingTable.tsx`

- Atualizar o `onSave` callback para passar os novos campos (`description`, `meeting_date`)
- Passar `initialDescription` e `initialMeetingDate` para o dialog

### 4. `src/components/meetings/MeetingCell.tsx`

- Ajustar a logica de "preenchido" para considerar `title` (nao apenas `meeting_link`) como indicador de reuniao registrada

### 5. `src/pages/Meetings.tsx`

- Atualizar o handler `onUpsert` para incluir os novos campos

## Detalhes Tecnicos

- O campo `description` ja existe na tabela `client_meetings` (tipo `text`, nullable)
- O campo `meeting_date` ja existe e e usado como referencia; agora o usuario podera ajustar a data real da reuniao
- A validacao muda: antes exigia `link`, agora exige `title` como campo obrigatorio
- Nenhuma migracao de banco necessaria -- todos os campos ja existem na tabela

