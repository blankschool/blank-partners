
# Correção de Tipografia - Scope Control

## Problema Identificado

Os números grandes nos cards de KPI e canais estão usando a fonte **Inter (sans-serif)** com `font-semibold`, quando deveriam usar **DM Serif Display (serif)** conforme o padrão visual do projeto.

## Padrão Estabelecido no Projeto

Baseado nas páginas Team, Clients e StageStatsPanel, o padrão para métricas grandes é:

```text
font-serif text-5xl font-normal tracking-tight
```

## Alterações Necessárias

### 1. ScopeKPISummary.tsx

| Linha | Atual | Corrigir Para |
|-------|-------|---------------|
| 40 | `text-3xl font-semibold tabular-nums` | `font-serif text-4xl font-normal tracking-tight` |
| 50 | `text-3xl font-semibold tabular-nums` | `font-serif text-4xl font-normal tracking-tight` |
| 70 | `text-3xl font-semibold tabular-nums` | `font-serif text-4xl font-normal tracking-tight` |

**Notas:**
- Usar `text-4xl` (ou `text-5xl`) para manter proporção visual adequada
- Remover `font-semibold` (DM Serif Display funciona melhor com `font-normal`)
- Adicionar `tracking-tight` para o espaçamento característico da fonte serif

### 2. ScopeChannelCards.tsx

| Linha | Atual | Corrigir Para |
|-------|-------|---------------|
| 70 | `text-3xl font-semibold tabular-nums` | `font-serif text-4xl font-normal tracking-tight` |

**Notas:**
- Manter as cores condicionais de status (`text-red-600`, `text-amber-600`, etc.)
- Aplicar o mesmo padrão tipográfico dos KPIs

## Comparação Visual

```text
ANTES (Inter - Sans-serif):
┌─────────────────────┐
│  PLANEJADO          │
│  1.408              │  ← Inter, font-semibold
└─────────────────────┘

DEPOIS (DM Serif Display):
┌─────────────────────┐
│  PLANEJADO          │
│  1.408              │  ← DM Serif Display, font-normal, tracking-tight
└─────────────────────┘
```

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/scope/ScopeKPISummary.tsx` | Atualizar 3 classes de métricas |
| `src/components/scope/ScopeChannelCards.tsx` | Atualizar 1 classe de percentual |

## Resultado Esperado

- Métricas grandes com tipografia elegante e corporativa (DM Serif Display)
- Consistência visual com as demais páginas do sistema (Team, Clients, Contents)
- Melhor hierarquia visual entre labels (uppercase, tracking-widest) e valores (serif, tracking-tight)
