

# Incluir Mes e Ano no Label do Relatorio

## Problema

O dropdown mostra apenas "Sem 1" sem indicar o mes/ano, dificultando a identificacao quando ha relatorios de meses diferentes.

## Solucao

Alterar a funcao `getReportLabel` em `MeetingLinkDialog.tsx` para incluir o mes abreviado e ano. O formato passara a ser:

- `"Sem 1/Fev 26 — Titulo"` para relatorios semanais
- `"Mensal/Fev 26 — Titulo"` para relatorios mensais

### Arquivo: `src/components/meetings/MeetingLinkDialog.tsx`

Atualizar a funcao `getReportLabel` para extrair mes e ano do `reference_date`:

```text
function getReportLabel(r: Report): string {
  const date = new Date(r.reference_date + "T12:00:00");
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthYear = `${monthNames[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
  const periodPrefix = r.report_period === "monthly"
    ? `Mensal/${monthYear}`
    : `Sem ${Math.ceil(date.getDate() / 7)}/${monthYear}`;
  const name = r.title || (r.report_link ? r.report_link.substring(0, 30) + '...' : 'Sem título');
  return `${periodPrefix} — ${name}`;
}
```

## Escopo

- 1 arquivo alterado: `MeetingLinkDialog.tsx`
- Apenas a funcao `getReportLabel` sera modificada

