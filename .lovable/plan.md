

# Ajuste: Visualizacao Calendario e Lista na aba Analise

## Problema

A aba "Analise" so mostra a tabela estatica. O usuario quer ter as mesmas opcoes de visualizacao (calendario e lista) tambem na aba de Analise, mas filtrando apenas os conteudos das etapas de producao (Edicao de Video e Criacao Design). Alem disso, o filtro de etapa deve ser ocultado na aba Analise, ja que as etapas estao pre-definidas.

## Solucao

### 1. Mostrar view toggle na aba Analise (`Contents.tsx`)

- Mudar `showViewToggle` para `true` em ambas as abas (remover condicional)
- Ocultar o filtro de etapa quando `activeTab === "analise"` (nova prop `showStageFilter`)

### 2. Adicionar visualizacao calendario/lista ao `ContentAnalysisPanel.tsx`

O painel de analise passa a receber `viewMode` e os handlers necessarios. Abaixo dos KPI cards, renderiza:
- **Calendario**: reutiliza `ContentCalendar` com os items ja filtrados por etapas de producao
- **Lista**: reutiliza `ContentCard` com variant "list"
- A tabela de detalhamento por cliente continua visivel em ambos os modos

### 3. Ocultar filtro de etapa na aba Analise (`ContentFilters.tsx`)

- Nova prop `showStageFilter?: boolean` (default `true`)
- Quando `false`, esconde o Select de etapas

## Arquivos

| Arquivo | Mudanca |
|---------|---------|
| `src/components/contents/ContentFilters.tsx` | Adicionar prop `showStageFilter`, esconder Select de etapa quando `false` |
| `src/components/contents/ContentAnalysisPanel.tsx` | Receber `viewMode`, `onDayClick`; renderizar `ContentCalendar` ou lista de `ContentCard` abaixo dos KPIs |
| `src/pages/Contents.tsx` | Passar `showViewToggle=true` sempre, `showStageFilter={activeTab === "painel"}`, passar `viewMode`/handlers ao `ContentAnalysisPanel`, gerenciar `DayContentDialog` para a aba analise |

## Fluxo

1. Na aba Analise, os items sao pre-filtrados para apenas Edicao de Video + Criacao Design (ja feito pelo `ContentAnalysisPanel`)
2. O toggle calendario/lista aparece nos filtros
3. Se calendario: mostra os KPI cards + calendario com apenas esses conteudos
4. Se lista: mostra os KPI cards + lista de cards com apenas esses conteudos
5. A tabela de detalhamento por cliente aparece sempre, abaixo da visualizacao

