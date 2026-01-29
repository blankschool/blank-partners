

# Performance Optimization for Contents Page

## Problem Analysis

The page is handling **12,342 content items** which causes severe performance issues when:
1. Changing views (calendar, list, grid)
2. Applying filters
3. Rendering the stats panel

### Root Causes Identified

1. **StageStatsPanel**: Calls `normalizeStatus()` on every item for each of the 6 groups = 74,052 function calls on every render

2. **ContentCalendar**: Creates a new `TooltipProvider` for each of the 35-42 calendar days, and calls `getStageConfig()` multiple times per item

3. **Grid/List views**: Renders all 12,342 items at once with no virtualization or pagination

4. **Missing memoization**: Components and derived data are recalculated on every state change

5. **Console warning**: `Badge` component receiving refs but not using `forwardRef`

## Solution Overview

| Area | Current Issue | Solution |
|------|---------------|----------|
| Stats calculation | O(n x groups) per render | Pre-compute once with `useMemo` |
| View rendering | All items rendered | Add pagination (50 items per page) |
| Calendar | TooltipProvider per day | Single TooltipProvider wrapper |
| ContentCard | Badge ref warning | Add forwardRef to Badge |
| Component updates | Re-render on any state change | Use `React.memo()` on child components |
| Transition | Immediate render blocks UI | Use `startTransition` for view/filter changes |

## Implementation Details

### 1. Contents.tsx - Add Pagination and Transitions

**Changes:**
- Import `startTransition` and `useCallback` from React
- Add pagination state (`currentPage`, `itemsPerPage = 50`)
- Wrap filter/view changes in `startTransition` to keep UI responsive
- Paginate `filteredItems` before rendering

```tsx
// New pagination logic
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 50;

const paginatedItems = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredItems.slice(start, start + ITEMS_PER_PAGE);
}, [filteredItems, currentPage]);

// Reset page when filters change
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, selectedPerson, selectedClient, selectedStage, selectedGroupFromPanel, dateRange]);
```

### 2. StageStatsPanel.tsx - Optimize Calculations

**Changes:**
- Pre-normalize all statuses in a single pass with `useMemo`
- Count items in one loop instead of filtering 6 times

```tsx
const groupCounts = useMemo(() => {
  // Pre-normalize all statuses once
  const normalizedItems = items.map(item => normalizeStatus(item.status));
  
  // Count in single pass
  const counts: Record<string, number> = {};
  STAGE_GROUPS.forEach(g => counts[g.key] = 0);
  
  normalizedItems.forEach(status => {
    const group = STAGE_GROUPS.find(g => g.stages.includes(status));
    if (group) counts[group.key]++;
  });
  
  return counts;
}, [items]);
```

### 3. ContentCalendar.tsx - Single TooltipProvider

**Changes:**
- Move `TooltipProvider` to wrap entire grid (not per day)
- Memoize day items lookup
- Limit content preview rendering

```tsx
// Before: <TooltipProvider> per day (35-42 providers!)
// After: Single wrapper
<TooltipProvider delayDuration={200}>
  <div className="grid grid-cols-7 gap-2">
    {calendarDays.map(day => (
      <Tooltip key={dateKey}>
        ...
      </Tooltip>
    ))}
  </div>
</TooltipProvider>
```

### 4. ContentCard.tsx - Add React.memo

**Changes:**
- Wrap component with `React.memo()` to prevent unnecessary re-renders
- Memoize date formatting

```tsx
export const ContentCard = React.memo(function ContentCard({ item, variant = "grid" }: ContentCardProps) {
  // ... existing code
});
```

### 5. Badge.tsx - Fix ref warning

**Changes:**
- Wrap Badge with `React.forwardRef` to eliminate console warnings

### 6. Add Pagination Controls Component

**New file:** `src/components/contents/ContentPagination.tsx`

Simple pagination controls showing:
- "Showing 1-50 of 12,342"
- Previous/Next buttons
- Page number indicator

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Contents.tsx` | Add pagination, startTransition, useCallback for handlers |
| `src/components/contents/StageStatsPanel.tsx` | Optimize group counting with single-pass algorithm |
| `src/components/contents/ContentCalendar.tsx` | Single TooltipProvider, add React.memo |
| `src/components/contents/ContentCard.tsx` | Add React.memo wrapper |
| `src/components/ui/badge.tsx` | Add forwardRef |
| `src/components/contents/ContentPagination.tsx` | New file for pagination UI |

## Expected Performance Improvement

| Metric | Before | After |
|--------|--------|-------|
| Stats panel calculations | 74,052 calls | ~12,342 calls (single pass) |
| Items rendered (grid/list) | 12,342 | 50 per page |
| TooltipProviders | 35-42 per calendar | 1 |
| Re-renders on filter change | All children | Only changed components |
| UI blocking during transitions | Yes | No (concurrent) |

## Technical Notes

- Calendar view will still show all items in their dates (no pagination needed there since it groups by day)
- Grid/List views will use pagination
- Pagination resets to page 1 when any filter changes
- `startTransition` marks view/filter changes as non-urgent, keeping UI responsive

