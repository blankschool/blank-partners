
# Distribute Stats Panel in 2 Rows with Full Width

## Problem

Currently the stat cards use `flex flex-wrap gap-4` which:
- Does not fill the full width of the container
- Cards wrap naturally based on their content width
- Last card (Cancelado) sits alone on the second row, not filling space

## Solution

Use a **CSS Grid layout** to:
1. First row: 6 cards (Todos + first 5 groups) distributed evenly across full width
2. Second row: 1 card (Cancelado) on the left

The grid should have 6 columns with equal width (`grid-cols-6`) so all cards on the first row are the same size. The last card (Cancelado) will naturally fall to the second row and take 1 column width.

## Visual Layout

```text
+-------+----------+--------+----------+------------+----------+
| TODOS | ESCREV.  | CRIAÇÃO| APROVAÇÃO| PRONTO P.. | PUBLICADO|
| 12342 | 1749     | 493    | 106      | 247        | 7779     |
+-------+----------+--------+----------+------------+----------+
| CANCELADO |
| 437       |
+------------+
```

## Implementation Details

### File: `src/components/contents/StageStatsPanel.tsx`

**Change container from flex to grid (line 22):**

| Property | Current | Updated |
|----------|---------|---------|
| Layout | `flex flex-wrap gap-4` | `grid grid-cols-6 gap-4` |

**Update button styling:**

| Property | Current | Updated |
|----------|---------|---------|
| Min width | `min-w-[120px]` | Remove (grid handles width) |
| Width | (none) | `w-full` (fill grid cell) |

The grid will ensure:
- 6 equal columns on the first row
- Cards stretch to fill their grid cell
- Last card (7th item - Cancelado) wraps to second row, taking 1 column

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/StageStatsPanel.tsx` | Change to 6-column grid layout, remove min-width, add w-full to buttons |

## Expected Result

1. First row: 6 cards evenly distributed across full width (Todos, Escrevendo, Criação, Aprovação, Pronto para postar, Publicado)
2. Second row: Cancelado card on the left
3. All cards have equal width within their row
4. Clean, organized layout matching the visual hierarchy
