

# Distribute Stats Panel into 2 Even Rows (4+3)

## Problem

Currently there are 7 stat cards using a 6-column grid:
- Row 1: 6 cards
- Row 2: 1 lonely card (Cancelado)

You want them distributed more evenly across 2 rows.

## Solution

Change to a **4-column grid** to get:
- Row 1: 4 cards (Todos, Escrevendo, Criacao, Aprovacao)
- Row 2: 3 cards (Pronto para postar, Publicado, Cancelado)

```text
Row 1: +--------+------------+----------+------------+
       | TODOS  | ESCREVENDO | CRIACAO  | APROVACAO  |
       | 12342  | 1748       | 494      | 106        |
       +--------+------------+----------+------------+

Row 2: +---------------+------------+------------+
       | PRONTO PARA.. | PUBLICADO  | CANCELADO  |
       | 246           | 7780       | 438        |
       +---------------+------------+------------+
```

## Implementation

### File: `src/components/contents/StageStatsPanel.tsx`

**Line 22 - Change grid from 6 columns to 4 columns:**

| Current | Updated |
|---------|---------|
| `grid grid-cols-6 gap-4 w-full` | `grid grid-cols-4 gap-4 w-full` |

```tsx
<div className="grid grid-cols-4 gap-4 w-full">
```

## Files to Modify

| File | Change |
|------|--------|
| `src/components/contents/StageStatsPanel.tsx` | Change `grid-cols-6` to `grid-cols-4` (line 22) |

## Expected Result

1. Row 1: 4 cards evenly distributed (Todos, Escrevendo, Criacao, Aprovacao)
2. Row 2: 3 cards evenly distributed (Pronto para postar, Publicado, Cancelado)
3. All cards take 1/4th of the total width
4. Balanced, professional 2-row layout

