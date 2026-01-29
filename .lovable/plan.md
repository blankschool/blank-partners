

# Fix Typography in StageStatsPanel

## Problem

The numbers in the StageStatsPanel are using the wrong typography. Looking at the screenshot and comparing with the Team page code, the numbers should use:

- **Font**: `font-serif` (DM Serif Display) - NOT sans-serif
- **Weight**: `font-normal` - NOT `font-semibold`

The current code uses `font-semibold tabular-nums` which creates a bold sans-serif look instead of the elegant serif typography seen on the Team page.

## Visual Comparison

```text
CURRENT (wrong):
+-------------+
| TODOS       |
| 12342       |  <- Bold sans-serif (Inter semibold)
+-------------+

CORRECT (Team page style):
+-------------+
| TODOS       |
| 12342       |  <- Elegant serif (DM Serif Display normal)
+-------------+
```

## Code Reference from Team Page

Looking at `src/pages/Team.tsx` line 122:
```tsx
<p className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">
  {teamData.length}
</p>
```

## Implementation

### File: `src/components/contents/StageStatsPanel.tsx`

**Update number typography (lines 30-31 and 51-53):**

| Property | Current (Wrong) | Correct |
|----------|-----------------|---------|
| Font family | (missing - defaults to sans) | `font-serif` |
| Font weight | `font-semibold` | `font-normal` |
| Numeric style | `tabular-nums` | (remove - serif uses proportional) |

**For the "Todos" count (line 30-31):**
```text
// Current
<span className="mt-2 text-5xl font-semibold tabular-nums tracking-tight text-foreground">

// Fix
<span className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">
```

**For the group counts (line 51-53):**
```text
// Current
<span className={cn("mt-2 text-5xl font-semibold tabular-nums tracking-tight", ...)}>

// Fix
<span className={cn("mt-2 font-serif text-5xl font-normal tracking-tight", ...)}>
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/StageStatsPanel.tsx` | Update number typography to use `font-serif font-normal` instead of `font-semibold tabular-nums` |

## Expected Result

Numbers in the StageStatsPanel will display with the elegant DM Serif Display font, matching the Team page typography exactly.

