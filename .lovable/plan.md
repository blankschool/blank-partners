
# Adicionar indicador "Pronto para Postar" na aba Analise

## O que muda

Um quarto KPI card sera adicionado para a etapa "Pronto para Postar", com o mesmo comportamento de toggle dos demais (Video, Design, Briefing). O grid passa de 3 para 4 colunas, e a tabela de detalhamento ganha uma coluna extra.

## Detalhes Tecnicos

### Arquivo: `src/components/contents/ContentAnalysisPanel.tsx`

1. Adicionar constante `READY_STAGES = ["pronto para postar"]`
2. Expandir o tipo `StageKey` para incluir `"ready"`: `type StageKey = "video" | "design" | "briefing" | "ready"`
3. Inicializar `activeStages` com `new Set(["video", "design", "briefing", "ready"])`
4. No `useMemo`, adicionar contagem de `ready` e campo `ready` no objeto `byClient`
5. Incluir a logica de filtro para `ready` no calculo de `productionItems` e `breakdown`
6. Mudar o grid de KPI cards de `grid-cols-3` para `grid-cols-4`
7. Adicionar o quarto card com cores amarelas (`yellow-200`/`yellow-600`), coerente com o stage "Pronto para postar" definido em `contentStages.ts`
8. Na tabela de detalhamento, adicionar coluna "Pronto" e incluir no calculo do total

Nenhum outro arquivo precisa ser alterado.
