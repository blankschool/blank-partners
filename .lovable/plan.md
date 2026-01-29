

# Improve Calendar Day Cell Contrast & Visibility

## Problem

The current calendar has no visual separation between day cells. As shown in the screenshot:
- Day cells blend together without borders or distinct backgrounds
- Day numbers (1, 2, 3...) are not visible
- Content cards run edge-to-edge making it hard to distinguish one day from another

## Solution

Add clear visual boundaries and improve the day cell design:

1. **Add border to each day cell** - Use a subtle border (`border border-border`) to define cell boundaries
2. **Add background color** - Light background (`bg-card`) for contrast against the parent
3. **Make day numbers visible** - Ensure the day number appears prominently at the top
4. **Add proper padding** - Create breathing room between content and cell edges

## Visual Comparison

```text
BEFORE (no separation):
Rony Meisler  Rony Meisler  Rony Meisler
Rony Meisler  Rony Meisler  Rony Meisler
+49 mais      +49 mais      +45 mais

AFTER (with borders and day numbers):
+-------------+-------------+-------------+
| 1           | 2           | 3           |
| Rony Meisler| Rony Meisler| Rony Meisler|
| Rony Meisler| Rony Meisler| Rony Meisler|
| +49 mais    | +49 mais    | +45 mais    |
+-------------+-------------+-------------+
```

## Implementation Details

### File: `src/components/contents/ContentCalendar.tsx`

**Update day cell button styling (lines 137-144):**

| Property | Current | Updated |
|----------|---------|---------|
| Background | None | `bg-card` |
| Border | None | `border border-border` |
| Hover | `hover:bg-muted/50` | `hover:bg-muted` |
| Padding | `p-1` | `p-2` |
| Height | `min-h-[80px]` | `min-h-[100px]` |

```text
// Before
className={cn(
  "min-h-[80px] p-1 rounded-lg text-sm transition-colors relative",
  "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
  ...
)}

// After
className={cn(
  "min-h-[100px] p-2 rounded-xl text-sm transition-colors relative",
  "bg-card border border-border",
  "hover:bg-muted hover:border-muted-foreground/20",
  "focus:outline-none focus:ring-2 focus:ring-ring",
  ...
)}
```

**Update day number styling (line 146-148):**

Make the day number more visible and add proper font styling:

```text
// Before
<span className="absolute top-1 left-2 text-xs">

// After
<span className="absolute top-2 left-2 text-xs font-medium text-foreground">
```

**Adjust grid gap (line 126):**

Increase the gap between cells for better visual separation:

```text
// Before
<div className="grid grid-cols-7 gap-1">

// After
<div className="grid grid-cols-7 gap-2">
```

**Update content preview position (line 152):**

Adjust positioning to account for larger padding:

```text
// Before
<div className="absolute bottom-1 left-1 right-1 space-y-0.5 overflow-hidden">

// After
<div className="absolute bottom-2 left-2 right-2 space-y-1 overflow-hidden">
```

## Styling Summary

| Element | Change |
|---------|--------|
| Day cell | Add `bg-card`, `border border-border`, `rounded-xl` |
| Day cell height | Increase from `80px` to `100px` |
| Day cell padding | Increase from `p-1` to `p-2` |
| Grid gap | Increase from `gap-1` to `gap-2` |
| Day number | Add `font-medium text-foreground` |
| Content cards | Slightly larger text (`text-[10px]`), better spacing |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentCalendar.tsx` | Update cell styling with borders, backgrounds, and improved spacing |

## Expected Result

1. Each day cell is clearly defined with visible borders
2. Day numbers (1-31) are prominently displayed at the top of each cell
3. Days are visually separated with consistent spacing
4. Hover state provides clear feedback
5. Content cards remain readable with proper contrast

