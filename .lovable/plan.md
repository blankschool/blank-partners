

# Reduce Calendar Cell Size

## Problem

The calendar cells use `aspect-square` which makes them as tall as they are wide. On a wide viewport, this results in very large cells (approximately 150-200px tall each), making the calendar take up excessive vertical space and requiring scrolling.

## Solution

Constrain the calendar grid to a maximum width and adjust the cell aspect ratio for a more compact display:

1. **Limit calendar grid width** - Add `max-w-4xl` (896px) to contain the calendar
2. **Reduce cell aspect ratio** - Change from `aspect-square` to a shorter aspect ratio or fixed height
3. **Center the calendar** - Add `mx-auto` to center the constrained grid

## Implementation Details

### File: `src/components/contents/ContentCalendar.tsx`

| Element | Current | Updated |
|---------|---------|---------|
| Calendar container | `<CardContent className="p-4">` | `<CardContent className="p-4 max-w-4xl mx-auto">` |
| Day cell | `aspect-square p-1 rounded-lg...` | `aspect-[4/3] p-1 rounded-lg...` or fixed `h-20` |

### Specific Changes

**Option 1 - Constrained aspect ratio (recommended)**:
```text
// Day button class
BEFORE: "aspect-square p-1 rounded-lg..."
AFTER:  "aspect-[4/3] p-1 rounded-lg..."

// Container
BEFORE: <CardContent className="p-4">
AFTER:  <CardContent className="p-4 max-w-5xl mx-auto">
```

This creates cells that are 4 units wide by 3 units tall - shorter than a square but still proportional.

**Option 2 - Fixed height**:
```text
// Day button class  
BEFORE: "aspect-square p-1..."
AFTER:  "h-20 p-1..."
```

Fixed 80px height cells regardless of width.

## Visual Comparison

```text
BEFORE (aspect-square, full width):
+-------+-------+-------+-------+-------+-------+-------+
|       |       |       |       |       |       |       |
|  5    |  6    |  7    |  8    |  9    |  10   |  11   |  ~200px tall
|       |       |       |       |       |       |       |
| ●●●●  | ●●●●  | ●●●●  | ●●●●  | ●●●●  | ●●●●  | ●●●●  |
+-------+-------+-------+-------+-------+-------+-------+

AFTER (aspect-[4/3], max-width constrained):
+------+------+------+------+------+------+------+
| 5    | 6    | 7    | 8    | 9    | 10   | 11   |  ~100px tall
|●●●●  |●●●●  |●●●●  |●●●●  |●●●●  |●●●●  |●●●●  |
+------+------+------+------+------+------+------+
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentCalendar.tsx` | Add max-width to container, change aspect ratio on cells |

## Expected Result

1. Calendar cells are approximately 50% shorter
2. Entire month fits on screen without scrolling
3. Content dots and day numbers remain visible and properly positioned
4. Calendar is centered on larger screens

