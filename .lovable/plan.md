

# Ajuste Visual da Celula de Relatorio Preenchido

## Problema

Quando um relatorio e preenchido, a celula usa `bg-primary/15` que fica quase branca e invisivel contra o fundo da tabela. Nao ha contraste suficiente para distinguir celulas preenchidas das vazias.

## Mudanca

Arquivo: `src/components/reports/ReportCell.tsx`

Alterar o estilo da celula preenchida para usar um verde solido que se destaque claramente:

- **Celula preenchida**: `bg-emerald-500/20 text-emerald-400` com hover `bg-emerald-500/30`
- **Celula vazia**: manter o estilo atual (cinza tracejado)

## Detalhes Tecnicos

Na celula preenchida (quando `report.report_link` existe), trocar:
- De: `bg-primary/15 text-primary hover:bg-primary/25`
- Para: `bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30`

Isso garante que o check verde se destaque contra o fundo escuro da tabela, tornando facil identificar quais relatorios ja foram entregues.

