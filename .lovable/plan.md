

# Mostrar Periodo do Relatorio no Dropdown

## Problema

Quando o relatorio nao tem titulo, so aparece o link truncado, dificultando a identificacao. O usuario quer ver a semana/mes do relatorio para facilitar a selecao.

## Solucao

Alterar o label de cada item no dropdown para incluir o periodo e a data de referencia. O formato sera:

- Com titulo: `"Sem 1 - Titulo do relatorio"` ou `"Mensal - Titulo do relatorio"`
- Sem titulo: `"Sem 1 - https://supabase.com/dash..."` ou `"Mensal - Relatorio sem titulo"`

### Arquivo: `src/components/meetings/MeetingLinkDialog.tsx`

Criar uma funcao helper que monta o label do relatorio:

```text
function getReportLabel(r: Report): string {
  const periodPrefix = r.report_period === "monthly"
    ? "Mensal"
    : `Sem ${getWeekNumber(r.reference_date)}`;
  const name = r.title || (r.report_link ? r.report_link.substring(0, 30) + '...' : 'Sem titulo');
  return `${periodPrefix} — ${name}`;
}
```

A funcao `getWeekNumber` calcula a semana com base no dia do `reference_date` (1-7 = Sem 1, 8-14 = Sem 2, etc).

Usar esse label tanto no `SelectItem` quanto na exibicao do valor selecionado.

## Escopo

- 1 arquivo alterado: `MeetingLinkDialog.tsx`
- Sem migracao, sem mudanca de hook

