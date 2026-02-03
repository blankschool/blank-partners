

# Scope Control - Redesign Completo

## Visão Geral

Redesenho completo da página de Controle de Escopo para suportar tomada de decisão operacional, com foco em identificar rapidamente clientes atrasados ou em overdelivery (scope creep).

## 1. Modelo de Dados

### Tabelas Existentes (Mantidas)
- `clients` - id, name, status
- `client_scopes` - planejado por canal (instagram, tiktok_posts, linkedin_posts, youtube_shorts, youtube_videos, recordings)
- `client_scope_actuals` - realizado por canal e mês

### Novas Definições de Tipos

```text
Status Rules:
- OUT_OF_SCOPE: planned = 0
- BEHIND (red): planned > 0 AND percent < 90%
- ON_TRACK (green): planned > 0 AND 90% <= percent <= 110%
- OVERDELIVERY (amber): planned > 0 AND percent > 110%
```

## 2. Arquitetura de Componentes

```text
src/
├── pages/
│   └── ScopeControl.tsx (refatorado)
├── hooks/
│   └── useScopeControl.tsx (refatorado - novo shape de dados)
├── components/scope/
│   ├── ScopeControlHeader.tsx (NOVO)
│   ├── ScopeControlFilters.tsx (NOVO)
│   ├── ScopeKPISummary.tsx (NOVO)
│   ├── ScopeChannelCards.tsx (NOVO)
│   ├── ScopeTopRisks.tsx (NOVO)
│   ├── ScopeDecisionTable.tsx (NOVO)
│   ├── ScopeClientRow.tsx (NOVO)
│   ├── ScopeChannelBreakdown.tsx (NOVO)
│   ├── ScopeStatusBadge.tsx (NOVO)
│   ├── ScopeDeltaPill.tsx (NOVO)
│   └── ChannelPendingDialog.tsx (mantido)
└── lib/
    └── scopeCalculations.ts (NOVO)
```

## 3. Layout da Página

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                          │
│  ┌────────────────────────────────┐  ┌─────────────────────────────────────────┐ │
│  │ Target  Controle de Escopo     │  │ [Period ▼] [Search___] [Filters...]    │ │
│  │         Compare planned vs...  │  │ [Toggle: Só desvios] [Toggle: Out-of-scope] │ │
│  └────────────────────────────────┘  └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│  SECTION A - KPI SUMMARY CARD                                                    │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  Planned    Actual     Delta       % of Plan    Status      Last Updated  │  │
│  │  1,206      1,522      +316        126%         OVERDELIVERY  há 12min    │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  SECTION B - CHANNEL CARDS                                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │   IG    │ │   TT    │ │   LI    │ │  YTS    │ │  YTV    │ │  GRAV   │       │
│  │  85%    │ │  —      │ │  110%   │ │  72%    │ │  95%    │ │  120%   │       │
│  │ 34/40   │ │Out of   │ │ 22/20   │ │ 18/25   │ │ 19/20   │ │ 24/20   │       │
│  │ BEHIND  │ │ Scope   │ │ON_TRACK │ │ BEHIND  │ │ON_TRACK │ │OVER     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  SECTION C - TOP RISKS (2 columns)                                               │
│  ┌──────────────────────────────┐ ┌──────────────────────────────────────────┐  │
│  │ Top 5 Behind                 │ │ Top 5 Overdelivery                       │  │
│  │ 1. Cliente A - 45%          │ │ 1. Cliente X - +15 entregas              │  │
│  │ 2. Cliente B - 52%          │ │ 2. Cliente Y - +12 entregas              │  │
│  │ ...                         │ │ ...                                      │  │
│  └──────────────────────────────┘ └──────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  SECTION D - DECISION TABLE                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ Cliente (sticky) │ Planned │ Actual │ Delta  │ % Plan │ Status   │ Actions│  │
│  ├───────────────────────────────────────────────────────────────────────────┤  │
│  │ ▸ Cliente A      │   45    │   20   │  -25   │  44%   │ BEHIND   │   ...  │  │
│  │   └─ [Expansion: Per-channel breakdown]                                   │  │
│  │ ▸ Cliente B      │   30    │   42   │  +12   │  140%  │ OVER     │   ...  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Componentes Detalhados

### 4.1 ScopeControlFilters.tsx

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| periodId | string | ID do período selecionado |
| searchQuery | string | Termo de busca |
| statusFilter | StatusType \| 'all' | Filtro de status |
| channelFilter | ChannelCode \| 'all' | Filtro de canal |
| showOnlyDeviations | boolean | Toggle para só mostrar desvios |
| includeOutOfScope | boolean | Toggle para incluir out-of-scope |

**Elementos UI:**
- Select para período (mês/ciclo)
- Input de busca com ícone Search
- Select para status (All, Behind, On Track, Overdelivery)
- Select para canal (All, IG, TT, LI, YTS, YTV, GRAV)
- Switch "Só desvios" (planned != actual)
- Switch "Incluir fora do escopo" (planned = 0)

### 4.2 ScopeKPISummary.tsx

Card horizontal com 6 métricas:

| Métrica | Descrição |
|---------|-----------|
| Planned | Total planejado (número) |
| Actual | Total realizado (número) |
| Delta | Diferença com sinal (+/-) |
| % of Plan | Percentual (se planned > 0) |
| Status | Badge com cor e texto |
| Last Updated | Timestamp relativo |

**Cores do Status Badge:**
- BEHIND: bg-red-500 text-white
- ON_TRACK: bg-green-500 text-white
- OVERDELIVERY: bg-amber-500 text-white (NÃO verde!)

### 4.3 ScopeChannelCards.tsx

Grid de 6 cards (um por canal):

**Caso planned > 0:**
- Percentual grande
- Texto "actual/planned"
- Delta com sinal
- Status badge pequeno
- Clicável → seta filtro de canal

**Caso planned = 0:**
- Label "Fora do escopo"
- Valores "—"
- Cor neutra/cinza
- Se actual > 0: ícone de warning "Entregue fora do escopo"

### 4.4 ScopeTopRisks.tsx

Duas colunas lado a lado:

**Top 5 Behind (mais atrasados):**
- Ordenado por % ascendente (onde planned > 0)
- Cada item: nome + % + clicável para destacar na tabela

**Top 5 Overdelivery (maior excesso):**
- Ordenado por delta descendente (onde planned > 0)
- Cada item: nome + "+X entregas" + clicável

### 4.5 ScopeDecisionTable.tsx

Tabela principal com:

**Colunas fixas:**
1. Cliente (sticky left) - com chevron de expansão
2. Planned (total)
3. Actual (total)
4. Delta - Pill colorido:
   - Negativo: red pill
   - Zero: neutral
   - Positivo: amber pill
5. % of Plan - Número ou "Fora do escopo"
6. Status - Badge
7. Actions (opcional)

**Ordenação padrão (risk-first):**
1. BEHIND: % ascendente (mais críticos primeiro)
2. OVERDELIVERY: delta descendente
3. ON_TRACK

**Expansão de linha:**
- Clique no chevron expande
- Mostra tabela interna por canal:
  - Canal | Planned | Actual | Delta | % | Status

### 4.6 ScopeStatusBadge.tsx

Componente reutilizável para badges de status:

```typescript
type ScopeStatus = 'OUT_OF_SCOPE' | 'BEHIND' | 'ON_TRACK' | 'OVERDELIVERY';

// Cores:
const statusColors = {
  OUT_OF_SCOPE: 'bg-gray-200 text-gray-700',
  BEHIND: 'bg-red-500 text-white',
  ON_TRACK: 'bg-green-500 text-white',
  OVERDELIVERY: 'bg-amber-500 text-white', // NÃO verde
};
```

### 4.7 ScopeDeltaPill.tsx

Pill para exibir delta:

```typescript
// delta < 0: red pill
// delta === 0: neutral pill
// delta > 0: amber pill (escopo excedido)
```

## 5. Lógica de Cálculo (scopeCalculations.ts)

```typescript
export type ScopeStatus = 'OUT_OF_SCOPE' | 'BEHIND' | 'ON_TRACK' | 'OVERDELIVERY';

export function calculatePercentOfPlan(planned: number, actual: number): number | null {
  if (planned === 0) return null;
  return (actual / planned) * 100;
}

export function calculateStatus(planned: number, actual: number): ScopeStatus {
  if (planned === 0) return 'OUT_OF_SCOPE';
  const percent = (actual / planned) * 100;
  if (percent < 90) return 'BEHIND';
  if (percent <= 110) return 'ON_TRACK';
  return 'OVERDELIVERY';
}

export function sortByRisk(clients: ClientScope[]): ClientScope[] {
  return [...clients].sort((a, b) => {
    const statusA = calculateStatus(a.totals.planned, a.totals.actual);
    const statusB = calculateStatus(b.totals.planned, b.totals.actual);
    
    // BEHIND first (by % asc), then OVERDELIVERY (by delta desc), then ON_TRACK
    const priority = { BEHIND: 0, OVERDELIVERY: 1, ON_TRACK: 2, OUT_OF_SCOPE: 3 };
    
    if (priority[statusA] !== priority[statusB]) {
      return priority[statusA] - priority[statusB];
    }
    
    if (statusA === 'BEHIND') {
      return (a.totals.actual / a.totals.planned) - (b.totals.actual / b.totals.planned);
    }
    if (statusA === 'OVERDELIVERY') {
      return (b.totals.actual - b.totals.planned) - (a.totals.actual - a.totals.planned);
    }
    
    return a.client_name.localeCompare(b.client_name);
  });
}
```

## 6. Hook useScopeControl (Refatorado)

Novo shape de retorno:

```typescript
interface ScopeData {
  period: { id: string; label: string; type: 'month' };
  lastUpdated: string;
  channels: ChannelTotals[];
  clients: ClientScope[];
}

interface ChannelTotals {
  code: ChannelCode;
  name: string;
  planned: number;
  actual: number;
}

interface ClientScope {
  client_id: string;
  client_name: string;
  totals: { planned: number; actual: number };
  by_channel: ChannelData[];
}
```

## 7. Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| src/lib/scopeCalculations.ts | CRIAR - Lógica centralizada |
| src/components/scope/ScopeControlHeader.tsx | CRIAR - Header da página |
| src/components/scope/ScopeControlFilters.tsx | CRIAR - Filtros e busca |
| src/components/scope/ScopeKPISummary.tsx | CRIAR - Card de KPIs |
| src/components/scope/ScopeChannelCards.tsx | CRIAR - Grid de canais |
| src/components/scope/ScopeTopRisks.tsx | CRIAR - Listas de risco |
| src/components/scope/ScopeDecisionTable.tsx | CRIAR - Tabela principal |
| src/components/scope/ScopeClientRow.tsx | CRIAR - Linha expansível |
| src/components/scope/ScopeChannelBreakdown.tsx | CRIAR - Breakdown por canal |
| src/components/scope/ScopeStatusBadge.tsx | CRIAR - Badge de status |
| src/components/scope/ScopeDeltaPill.tsx | CRIAR - Pill de delta |
| src/hooks/useScopeControl.tsx | MODIFICAR - Novo shape |
| src/pages/ScopeControl.tsx | MODIFICAR - Nova estrutura |

## 8. Regras de UI/UX

### Cores de Status
- **BEHIND**: Vermelho (red-500) - Indica problema
- **ON_TRACK**: Verde (green-500) - Tudo OK
- **OVERDELIVERY**: Âmbar (amber-500) - NUNCA verde! É scope creep
- **OUT_OF_SCOPE**: Cinza (gray-400) - Neutro

### Acessibilidade
- Sempre usar cor + texto (não apenas cor)
- Labels claros para todos os filtros
- Contraste adequado para badges

### Responsividade
- Cards de canal: 2 cols mobile, 3 tablet, 6 desktop
- Tabela: scroll horizontal em mobile
- Cliente sticky left sempre visível

## 9. Edge Cases

| Cenário | Tratamento |
|---------|------------|
| planned > 0, actual não existe | actual = 0 |
| planned = 0, actual > 0 | OUT_OF_SCOPE + warning icon |
| Nenhum dado para período | Empty state com orientação |
| Percentual > 100% | Mostrar valor real (ex: 140%) |
| planned = 0 para todos | Mostrar "Fora do escopo" |

## 10. Ordem de Implementação

1. **scopeCalculations.ts** - Lógica base
2. **ScopeStatusBadge.tsx** e **ScopeDeltaPill.tsx** - Componentes atômicos
3. **useScopeControl.tsx** - Refatorar hook
4. **ScopeKPISummary.tsx** - KPI card
5. **ScopeChannelCards.tsx** - Cards de canal
6. **ScopeTopRisks.tsx** - Listas de risco
7. **ScopeControlFilters.tsx** - Filtros
8. **ScopeClientRow.tsx** e **ScopeChannelBreakdown.tsx** - Linha expansível
9. **ScopeDecisionTable.tsx** - Tabela completa
10. **ScopeControl.tsx** - Integração final

