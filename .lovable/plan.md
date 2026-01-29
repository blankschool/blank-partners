

# Fix Calendar Date Selection Visual Feedback

## Problem

When clicking a date in the calendar, nothing visually changes because:

1. The Calendar uses **controlled mode** with `selected={dateRange}`
2. When clicking the first date, `onSelect` receives `{ from: date, to: undefined }`
3. Since `to` is undefined, we don't update `dateRange` via `onPeriodChange`
4. The Calendar re-renders with the **same old** `selected` value
5. Result: The first click appears to do nothing

## Solution

Add **local state** in `ContentFilters` to track the intermediate selection while the user picks dates. Only propagate to the parent when a complete range is selected.

## Implementation

### File: `src/components/contents/ContentFilters.tsx`

**1. Add local state for intermediate selection (around line 61)**

```tsx
const [calendarOpen, setCalendarOpen] = useState(false);
const [pendingRange, setPendingRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
```

**2. Sync pendingRange when dateRange prop changes or popover closes (add useEffect)**

```tsx
// Reset pending range when popover closes or external dateRange changes
React.useEffect(() => {
  if (!calendarOpen) {
    setPendingRange(dateRange ? { from: dateRange.from, to: dateRange.to } : undefined);
  }
}, [calendarOpen, dateRange]);
```

**3. Update Calendar to use pendingRange for display (line 187-188)**

```tsx
<Calendar
  mode="range"
  selected={pendingRange}
  onSelect={(range) => {
    setPendingRange(range || undefined);
    if (range?.from && range?.to) {
      // Complete range selected - apply filter and close
      onPeriodChange("custom", { from: range.from, to: range.to });
      setCalendarOpen(false);
    }
    // If only "from" is selected, keep calendar open for second click
  }}
  locale={ptBR}
  className={cn("p-3 pointer-events-auto")}
/>
```

**4. Add React import for useEffect (line 1)**

```tsx
import { useState, useEffect } from "react";
```

## How It Works

| Step | Action | pendingRange | dateRange | Visual |
|------|--------|--------------|-----------|--------|
| 1 | Open popover | syncs from dateRange | unchanged | Shows current selection |
| 2 | Click first date | `{ from: Jan 15 }` | unchanged | First date highlighted |
| 3 | Click second date | `{ from: Jan 15, to: Jan 20 }` | updated to range | Range highlighted, popover closes |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentFilters.tsx` | Add `pendingRange` state, useEffect to sync, update Calendar to use local state |

