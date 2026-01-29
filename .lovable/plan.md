
# Filter Stats Panel by Date Range

## Problem

Currently, the `StageStatsPanel` (showing TODOS 12361, ESCREVENDO 1764, etc.) always displays counts from **all** content items, regardless of the date filter or other filters applied.

When you filter by date range, the calendar and content list update correctly, but the stats panel still shows the total counts.

## Solution

Create an intermediate filtered list that applies date, person, and client filters (but NOT the stage/group filter) and pass that to the `StageStatsPanel`. This way:
- Date filter updates the stats
- Person filter updates the stats
- Client filter updates the stats
- Clicking on a stage category still works as a filter toggle

## Implementation

### File: `src/pages/Contents.tsx`

**1. Add a new `itemsForStats` computed value (after line 73)**

Create a filtered list that applies date, person, client, and search filters:

```tsx
// Items filtered by date, person, client, and search (for stats panel)
const itemsForStats = useMemo(() => {
  return items.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.id.toLowerCase().includes(query) ||
        item.client.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Person (SM) filter
    if (selectedPerson !== "all") {
      if (item.socialMedia !== selectedPerson) return false;
    }

    // Client filter
    if (selectedClient !== "all") {
      if (item.client !== selectedClient) return false;
    }

    // Date range filter
    if (dateRange) {
      const itemDate = parseDate(item.date);
      if (!itemDate || !isWithinInterval(itemDate, { start: dateRange.from, end: dateRange.to })) {
        return false;
      }
    }

    return true;
  });
}, [items, searchQuery, selectedPerson, selectedClient, dateRange]);
```

**2. Update the StageStatsPanel to use `itemsForStats` (line 235)**

```tsx
<StageStatsPanel
  items={itemsForStats}  // Changed from `items`
  selectedGroup={selectedGroupFromPanel}
  onGroupClick={handleGroupFromPanel}
/>
```

## How It Works

| Filter Applied | Stats Panel Shows |
|----------------|-------------------|
| No filters | All 12,361 items |
| Date: Jan 15-20 | Only items in that date range |
| Client: "Rony Meisler" | Only items for that client |
| Date + Client | Items matching both filters |

The stage/group filter is intentionally NOT applied to the stats, because the stats panel itself is used to filter by stage. If we applied it, clicking on a category would hide the other categories.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Contents.tsx` | Add `itemsForStats` memo, pass to `StageStatsPanel` |
