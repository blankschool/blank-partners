

# Fix Stats Panel to Fill Full Container Width

## Problem

Looking at the screenshot, the grid IS working (6 cards on row 1, 1 on row 2), but the cards are NOT stretching to fill the full container width. The grid container needs explicit full-width styling.

## Current Issue

The grid container has `grid grid-cols-6 gap-4` but is NOT filling the full width of its parent container.

## Solution

Add `w-full` to the grid container to ensure it stretches to the full width of the parent.

## Implementation

### File: `src/components/contents/StageStatsPanel.tsx`

**Line 22 - Add `w-full` to container:**

| Current | Updated |
|---------|---------|
| `grid grid-cols-6 gap-4` | `grid grid-cols-6 gap-4 w-full` |

```tsx
// Line 22
<div className="grid grid-cols-6 gap-4 w-full">
```

## Files to Modify

| File | Change |
|------|--------|
| `src/components/contents/StageStatsPanel.tsx` | Add `w-full` to the grid container (line 22) |

## Expected Result

1. Grid container stretches to full width of parent
2. 6 columns distribute evenly across the full width
3. Each card takes 1/6th of the total width
4. Cancelado card on second row takes same 1/6th width

