

# Fix Calendar Day Number Overlap

## Problem

The content cards in the calendar day cells are overlapping and covering the day numbers (1, 2, 3, etc.) as shown in the screenshot. The current layout uses absolute positioning for both:
- Day number: `absolute top-2 left-2`
- Content cards: `absolute bottom-2 left-2 right-2`

When there are many items, the content area grows upward and covers the day number.

## Solution

Change the day cell layout from fully absolute positioning to a **flex column layout** with:
1. A fixed header area for the day number (always visible)
2. A content area below that grows to show the cards

This ensures the day number has dedicated space that cannot be overlapped.

## Visual Comparison

```text
BEFORE (overlapping):
+---------------+
| [Rony Meisler]| <- covers the "30"
| [Rony Meisler]|
| +49 mais      |
+---------------+

AFTER (proper layout):
+---------------+
| 30            | <- day number always visible
| [Rony Meisler]|
| [Rony Meisler]|
| +49 mais      |
+---------------+
```

## Implementation Details

### File: `src/components/contents/ContentCalendar.tsx`

**Change day cell from absolute positioning to flex column (lines 137-176):**

| Element | Current | Updated |
|---------|---------|---------|
| Button layout | Relative with absolute children | `flex flex-col` |
| Day number | `absolute top-2 left-2` | Static, in header area with margin-bottom |
| Content area | `absolute bottom-2` | `flex-1` to fill remaining space, positioned at bottom with `mt-auto` |

```text
// Before
<button className="min-h-[100px] p-2 rounded-xl ... relative">
  <span className="absolute top-2 left-2">30</span>
  <div className="absolute bottom-2 left-2 right-2">
    [content cards]
  </div>
</button>

// After
<button className="min-h-[100px] p-2 rounded-xl ... flex flex-col">
  <span className="text-xs font-medium text-foreground mb-1">30</span>
  <div className="mt-auto space-y-1 overflow-hidden">
    [content cards]
  </div>
</button>
```

## Specific Code Changes

**Button className (line 139-146):**
- Remove `relative`
- Add `flex flex-col`

**Day number span (line 148-150):**
- Remove `absolute top-2 left-2`
- Add `mb-1` for spacing below

**Content preview div (line 154):**
- Remove `absolute bottom-2 left-2 right-2`
- Add `mt-auto` to push content to the bottom of the flex container

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/contents/ContentCalendar.tsx` | Change day cell from absolute positioning to flex column layout |

## Expected Result

1. Day numbers (1-31) are always visible at the top of each cell
2. Content cards appear below the day number, pushed to the bottom
3. No overlap between day number and content cards
4. Layout remains clean and organized with proper spacing

