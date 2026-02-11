
# Corrigir Nome do Relatorio no Dropdown

## Problema

O relatorio vinculado no dropdown nao mostra nome porque o campo `title` esta vazio no banco de dados. O `SelectItem` renderiza `{r.title}` que e uma string vazia.

## Solucao

Atualizar o `MeetingLinkDialog.tsx` para exibir um texto fallback quando o titulo do relatorio estiver vazio. A logica sera:

1. Se `title` existir, mostrar o titulo
2. Se nao, mostrar o `report_link` truncado (ex: "https://supabase.com/dash..." )
3. Se nenhum dos dois existir, mostrar "Relatorio sem titulo"

### Arquivo: `src/components/meetings/MeetingLinkDialog.tsx`

Alterar o `SelectItem` dos relatorios para usar um label com fallback:

```text
// De:
{r.title}

// Para:
{r.title || (r.report_link ? r.report_link.substring(0, 40) + '...' : 'Relatório sem título')}
```

Tambem atualizar o `SelectValue` para mostrar o label correto quando um relatorio esta selecionado.

### Arquivo: `src/components/meetings/MeetingLinkDialog.tsx` (SelectValue)

O `SelectValue` do Select tambem precisa mostrar o nome correto do relatorio selecionado, nao apenas o placeholder.

## Escopo

- Apenas 1 arquivo alterado: `MeetingLinkDialog.tsx`
- Sem migracao de banco
- Sem mudanca de logica, apenas exibicao
