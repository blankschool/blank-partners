
# Adicionar indicador "Em Briefing" na aba Analise

## Mudanca

Adicionar um terceiro KPI card para a etapa "Em Briefing" ao lado dos cards existentes de Edicao de Video e Criacao Design. A contagem, a visualizacao (calendario/lista) e a tabela de detalhamento por cliente passam a incluir tambem esses conteudos.

## Detalhes Tecnicos

### Arquivo: `src/components/contents/ContentAnalysisPanel.tsx`

1. Adicionar constante `BRIEFING_STAGES = ["em briefing"]`
2. Atualizar `PRODUCTION_STAGES` para incluir briefing
3. No `useMemo`, adicionar contagem de briefing e campo `briefing` no `byClient`
4. Mudar o grid de KPI cards de `grid-cols-2` para `grid-cols-3`
5. Adicionar um terceiro card com cores azuis (`blue-100`/`blue-600`, coerente com o stage "Em briefing" definido em `contentStages.ts`)
6. Na tabela de detalhamento, adicionar coluna "Briefing" e incluir briefing no total
