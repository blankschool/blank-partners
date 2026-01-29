

# Reorder View Mode Toggle: Calendar First

## Change Summary

Move the Calendar button to be the first option in the view mode toggle, matching the user's preference shown in the screenshot.

## Current Order
```text
[ Grid ] [ List ] [ Calendar ]
```

## New Order
```text
[ Calendar ] [ Grid ] [ List ]
```

## Implementation

### File: `src/components/contents/ContentFilters.tsx`

**Lines 214-237** - Reorder the three buttons:

```tsx
{/* View mode toggle */}
<div className="flex items-center rounded-xl border border-border p-1">
  <Button
    variant={viewMode === "calendar" ? "secondary" : "ghost"}
    size="sm"
    onClick={() => onViewModeChange("calendar")}
    className="rounded-lg"
  >
    <CalendarIcon className="h-4 w-4" />
  </Button>
  <Button
    variant={viewMode === "grid" ? "secondary" : "ghost"}
    size="sm"
    onClick={() => onViewModeChange("grid")}
    className="rounded-lg"
  >
    <Grid3X3 className="h-4 w-4" />
  </Button>
  <Button
    variant={viewMode === "list" ? "secondary" : "ghost"}
    size="sm"
    onClick={() => onViewModeChange("list")}
    className="rounded-lg"
  >
    <List className="h-4 w-4" />
  </Button>
</div>
```

## Files to Modify

| File | Change |
|------|--------|
| `src/components/contents/ContentFilters.tsx` | Reorder buttons: Calendar → Grid → List (lines 214-237) |

