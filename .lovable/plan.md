

# Fix Day Content Dialog Background Contrast

## Problem

The dialog background is too dark in dark mode, making it difficult to read the content. The current styling uses:
- Dialog background: `bg-card/90` (card color is ~12% lightness in dark mode)
- Content cards: `bg-muted/50` (muted is ~15% lightness)

This results in a dark-on-dark appearance with poor contrast.

## Solution

Override the dialog background specifically in `DayContentDialog.tsx` to use a lighter background color that provides better contrast. Two approaches:

### Option A: Use lighter card variant
Add explicit background classes to the DialogContent to make it lighter in dark mode while maintaining the design language.

### Option B: Use background color with higher contrast
Use `bg-background` or a custom lighter value that works better in dark mode.

## Implementation

Modify `DayContentDialog.tsx` to add custom styling:

| Element | Current | Updated |
|---------|---------|---------|
| DialogContent | `className="max-w-md"` | `className="max-w-md bg-card dark:bg-neutral-800"` |
| Content cards | `bg-muted/50 border-border/50` | `bg-background dark:bg-neutral-900 border-border` |

The changes use:
- `dark:bg-neutral-800` for the dialog background (~31% lightness) - significantly lighter than current card (~12%)
- `dark:bg-neutral-900` for content cards (~17% lightness) - darker than dialog for visual hierarchy

This creates a layered effect where:
- Dialog background is lighter (neutral-800)
- Content cards are slightly darker (neutral-900)
- Text and badges stand out clearly

## File to Modify

| File | Changes |
|------|---------|
| `src/components/contents/DayContentDialog.tsx` | Add dark mode background overrides for better contrast |

## Visual Comparison

```text
BEFORE (poor contrast):
+----------------------------------------+
| Dialog bg: ~12% lightness              |
|   +----------------------------------+ |
|   | Card bg: ~15% lightness          | |
|   +----------------------------------+ |
+----------------------------------------+

AFTER (good contrast):
+----------------------------------------+
| Dialog bg: ~31% lightness (neutral-800)|
|   +----------------------------------+ |
|   | Card bg: ~17% lightness (neutral-900)
|   +----------------------------------+ |
+----------------------------------------+
```

## Expected Result

1. Dialog background is noticeably lighter in dark mode
2. Content cards have clear visual separation from dialog background
3. Text and stage badges are easy to read with sufficient contrast
4. Maintains design consistency with the rest of the application

