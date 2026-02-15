

# Painel de Performance de Relatorios

## Objetivo

Criar um painel de indicadores e grafico acima da tabela de relatorios, mostrando a performance de entrega do mes selecionado: quantos relatorios eram esperados, quantos foram entregues, taxa de cumprimento geral e por semana, alem de um grafico de barras comparando projetado vs realizado por semana.

## Dados e Logica

Os dados ja existem: a lista de `clients` define o "projetado" (cada cliente deve ter 1 relatorio por semana + 1 mensal), e a lista de `reports` define o "realizado" (relatorios ja cadastrados com link).

Calculos:
- **Projetado por semana**: numero de clientes (cada um deve ter 1 relatorio semanal)
- **Projetado mensal**: numero de clientes (cada um deve ter 1 mensal)
- **Projetado total do mes**: (clientes x 4 semanas) + clientes = clientes x 5
- **Realizado**: contagem de relatorios existentes para cada periodo
- **Taxa**: realizado / projetado x 100

## Componentes

### 1. Painel KPI (`ReportStatsPanel.tsx`)

Cards de metricas no estilo existente (uppercase label + numero grande serif), seguindo o padrao do `StageStatsPanel` e `ScopeKPISummary`:

| Card | Valor |
|------|-------|
| Total Projetado | clientes x 5 |
| Total Entregue | count de reports do mes |
| Taxa Geral | entregue/projetado % |
| Pendentes | projetado - entregue |

Grid de 4 colunas com `rounded-2xl border`.

### 2. Grafico Projetado vs Realizado (`ReportDeliveryChart.tsx`)

Grafico de barras agrupadas (recharts `BarChart`) com:
- Eixo X: Sem 1, Sem 2, Sem 3, Sem 4, Mensal
- Duas barras por grupo: Projetado (cor neutra) e Realizado (cor accent)
- Seguindo o estilo visual do `ContentPerformanceChart` existente (cores CSS vars, tooltip estilizado, sem eixo vertical, grid tracejado)

### 3. Integracao na pagina (`Reports.tsx`)

Adicionar os dois componentes acima da tabela, na ordem:
1. `ReportStatsPanel` (cards KPI)
2. `ReportDeliveryChart` (grafico)
3. `ReportTrackingTable` (tabela existente)

Os dados serao calculados via `useMemo` na pagina `Reports.tsx` e passados como props.

## Arquivos

| Arquivo | Acao |
|---------|------|
| `src/components/reports/ReportStatsPanel.tsx` | Criar - painel de KPIs |
| `src/components/reports/ReportDeliveryChart.tsx` | Criar - grafico barras |
| `src/pages/Reports.tsx` | Editar - calcular metricas e renderizar novos componentes |

## Estilo Visual

- Cards KPI: `rounded-2xl border bg-card p-5`, label `text-[10px] uppercase tracking-widest text-muted-foreground`, valor `font-serif text-4xl`
- Grafico: `Card` com `CardHeader` + `CardContent`, altura 240px, barras com `radius={[4,4,0,0]}`, cores `var(--chart-1)` e `var(--chart-3)`
- Barra de progresso nas metricas semanais usando o componente `Progress` existente

