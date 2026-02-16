
# Filtro por indicador na aba Analise

## O que muda

Os tres KPI cards (Edicao de Video, Criacao Design, Em Briefing) passam a funcionar como toggles clicaveis. Por padrao, todos vem selecionados. Ao clicar em um card, ele alterna entre ativo/inativo. Isso filtra o calendario/lista e a tabela de detalhamento, mostrando apenas os conteudos das etapas selecionadas.

## Comportamento

- Todos os cards iniciam selecionados (ativos)
- Clicar em um card desativa/ativa aquele indicador
- Pelo menos um indicador deve permanecer ativo (o ultimo ativo nao pode ser desativado)
- Cards inativos ficam com visual "apagado" (opacidade reduzida, borda tracejada)
- O calendario, lista e tabela de detalhamento refletem apenas os indicadores ativos

## Detalhes Tecnicos

### Arquivo: `src/components/contents/ContentAnalysisPanel.tsx`

1. Adicionar estado `activeStages` do tipo `Set<"video" | "design" | "briefing">`, iniciando com todos
2. Criar handler `toggleStage(stage)` que adiciona/remove do Set, impedindo que fique vazio
3. Tornar cada KPI card clicavel (`cursor-pointer`, `onClick`) e aplicar classe condicional de opacidade (`opacity-40`) quando inativo
4. No `useMemo` de `productionItems`, filtrar com base nas stages ativas:
   - Se `activeStages` nao tem "video", ignorar items de `VIDEO_STAGES`
   - Se nao tem "design", ignorar `DESIGN_STAGES`
   - Se nao tem "briefing", ignorar `BRIEFING_STAGES`
5. A tabela de detalhamento esconde colunas de indicadores inativos e recalcula o total
6. Resetar `currentPage` para 1 quando `activeStages` mudar

Nenhum outro arquivo precisa ser alterado.
