

# Fix Júnior Stat Card Number Color

## Problem

The Júnior stat card number is using `text-primary` which maps to a very light color (`oklch(0.9800 0 0)`) in light mode, making it nearly invisible against the white card background.

## Solution

Change the color class from `text-primary` to `text-foreground` to display the number in black, matching the readability of the "Membros" card which already uses this approach.

## File Change

**`src/pages/Team.tsx` (line 157)**

```tsx
// Before:
<p className="mt-2 font-serif text-5xl font-normal tracking-tight text-primary">

// After:
<p className="mt-2 font-serif text-5xl font-normal tracking-tight text-foreground">
```

## Visual Result

| Card | Current Color | New Color |
|------|---------------|-----------|
| Membros | Black (text-foreground) | No change |
| Sênior | Green (text-success) | No change |
| Pleno | Black (text-accent-orange) | No change |
| Júnior | Almost invisible (text-primary) | Black (text-foreground) |

