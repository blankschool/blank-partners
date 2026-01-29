

# Enable Single Date Selection in Period Filter

## Problem

Currently the calendar filter only works with:
1. Preset options (Tudo, Semana, Mes)
2. Date ranges (selecting FROM and TO dates)

The user wants to be able to select a **single specific date** to filter content for just that day.

## Solution

Allow the calendar to accept single date selection. When a single date is clicked:
- Set both `from` and `to` to the same date (treating it as a 1-day range)
- Close the popover immediately
- Display the single date in the button label

## Implementation

### File: `src/components/contents/ContentFilters.tsx`

**1. Update the Calendar selection logic (lines 182-193)**

Change the `onSelect` handler to accept single date clicks:

```tsx
<Calendar
  mode="range"
  selected={dateRange ? { from: dateRange.from, to: dateRange.to } : undefined}
  onSelect={(range) => {
    if (range?.from) {
      // If only "from" is selected (single click), treat as single day
      const to = range.to || range.from;
      onPeriodChange("custom", { from: range.from, to });
      // Close popover if we have a complete selection (single date or range)
      if (!range.to || range.to) {
        setCalendarOpen(false);
      }
    }
  }}
  locale={ptBR}
  className={cn("p-3 pointer-events-auto")}
/>
```

**2. Update the period label (lines 82-90)**

Show a single date when `from` and `to` are the same:

```tsx
const getPeriodLabel = () => {
  if (periodType === "all") return "Todo período";
  if (periodType === "week") return "Esta semana";
  if (periodType === "month") return "Este mês";
  if (dateRange) {
    // Check if it's a single day
    const isSameDay = dateRange.from.toDateString() === dateRange.to.toDateString();
    if (isSameDay) {
      return format(dateRange.from, "dd/MM/yyyy");
    }
    return `${format(dateRange.from, "dd/MM")} - ${format(dateRange.to, "dd/MM")}`;
  }
  return "Selecionar período";
};
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentFilters.tsx` | Update `onSelect` to handle single dates, update label to show single date format |

## User Experience

| Action | Result |
|--------|--------|
| Click single date | Filters to that day, shows "29/01/2026" |
| Click two dates | Filters to range, shows "29/01 - 31/01" |
| Click "Tudo" | Shows all, label shows "Todo periodo" |
| Click "Semana" | Filters current week |
| Click "Mes" | Filters current month |

