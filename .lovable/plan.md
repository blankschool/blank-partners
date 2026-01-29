

# Update Content Stats Panel to Match Team Page Design

## Problem

The StageStatsPanel on the Contents page uses a different visual style than the Team page stats:
- Numbers are small (`text-2xl` vs `text-5xl`)
- Layout is centered with number on top, label on bottom
- Missing the hierarchical layout (label > number > description)

## Solution

Redesign the StageStatsPanel to follow the Team page pattern:
1. Label at TOP (uppercase, small, tracking-widest)
2. Number in MIDDLE (serif, large 5xl, tabular-nums)
3. Keep as interactive buttons for filtering

## Visual Comparison

```text
CURRENT (Contents):
+-------------+
|    12340    |  <- small number (2xl)
|    TODOS    |  <- label below
+-------------+

TARGET (Team style):
+-------------+
| TODOS       |  <- label on top (uppercase tracking)
| 12340       |  <- large number (5xl serif)
+-------------+
```

## Implementation Details

### File: `src/components/contents/StageStatsPanel.tsx`

**Update button layout and typography:**

| Property | Current | Updated |
|----------|---------|---------|
| Button layout | `items-center justify-center` | `items-start` (left-aligned) |
| Number size | `text-2xl` | `text-4xl` or `text-5xl` |
| Number font | `font-serif` | `font-sans text-5xl font-semibold tabular-nums tracking-tight` |
| Label position | Below number | Above number |
| Padding | `p-4` | `p-5` |
| Min width | `min-w-[100px]` | `min-w-[120px]` |

**New structure for each stat button:**

```text
<button className="flex flex-col items-start min-w-[120px] p-5 rounded-2xl border ...">
  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
    {label}
  </span>
  <span className="mt-2 font-sans text-5xl font-semibold tabular-nums tracking-tight text-foreground">
    {count}
  </span>
</button>
```

**Apply to both "Todos" button and group buttons:**

The same pattern applies to the "All items" stat and each stage group button, maintaining the interactive click-to-filter behavior.

## Typography Alignment with Memory

Per the project's typography memory:
- Use `font-sans` (Inter) with `tabular-nums` for numerical metrics
- Use `text-5xl font-semibold tracking-tight` for large numbers
- Reserve `font-serif` for textual headings, not numbers

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/StageStatsPanel.tsx` | Update layout, typography, and spacing to match Team page pattern |

## Expected Result

1. Numbers display as large `text-5xl` with Inter font and tabular-nums
2. Labels appear ABOVE the numbers in small uppercase style
3. Layout is left-aligned like Team page cards
4. Interactive filtering behavior is preserved
5. Selected state styling continues to work

