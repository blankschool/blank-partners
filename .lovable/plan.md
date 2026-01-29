

# Fix Calendar Range Selection Behavior

## Problem

Currently, the calendar closes immediately when clicking the first date. The user wants to:
1. Click first date → Select it, keep calendar **open**
2. Click second date → Complete the range, **then** close and filter

## Solution

Only close the popover when both `from` and `to` dates are selected (a complete range). If only `from` is selected, keep the calendar open so the user can select the end date.

## Implementation

### File: `src/components/contents/ContentFilters.tsx`

**Lines 189-195** - Update the `onSelect` handler:

```tsx
onSelect={(range) => {
  if (range?.from) {
    if (range.to) {
      // Complete range selected - apply filter and close
      onPeriodChange("custom", { from: range.from, to: range.to });
      setCalendarOpen(false);
    }
    // If only "from" is selected, keep calendar open for second click
  }
}}
```

## User Experience

| Action | Result |
|--------|--------|
| Click first date | Date is highlighted, calendar stays open |
| Click second date | Range is selected, calendar closes, filter applied |
| Click preset (Tudo/Semana/Mês) | Applies immediately and closes |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/contents/ContentFilters.tsx` | Only close calendar when both dates are selected |

