
# Fix Typography Inconsistencies on Dashboard

## Problem Analysis

The StatCard numbers (24, 358, 312, 4.8%) display with inconsistent character styling. This happens because DM Serif Display font uses **oldstyle/proportional numerals** where certain digits (3, 5, 8) have distinctive descenders and varying widths compared to other digits (2, 4).

This is a font design characteristic, not a bug - but it creates an unintended visual inconsistency for numerical metrics.

## Solution

For numerical metrics and data displays, use Inter font (font-sans) which has uniform, tabular-lining numerals. Reserve DM Serif Display for headings and text content only.

## Changes Required

### 1. StatCard.tsx - Fix Numeric Display

| Element | Current | Updated |
|---------|---------|---------|
| Value (line 24) | `font-serif text-5xl font-normal` | `font-sans text-5xl font-semibold tabular-nums` |
| Description (line 26) | `text-sm text-muted-foreground` | `font-sans text-sm text-muted-foreground` |
| Trend text (line 31-36) | `text-xs font-medium` | `font-sans text-xs font-medium` |

### 2. Add Tabular Numerals Utility

Add a CSS utility class to ensure consistent numeral width across all metrics:

```text
src/index.css:
+------------------------------------------+
| .tabular-nums {                          |
|   font-variant-numeric: tabular-nums;    |
| }                                        |
+------------------------------------------+
```

### 3. Update Project Typography Guidelines

Clarify the typography rule in memory:
- DM Serif Display: Headings, welcome messages, dates (text content)
- Inter: Metrics, numbers, UI elements, body text

## Files to Modify

| File | Change |
|------|--------|
| `src/components/dashboard/StatCard.tsx` | Change value to `font-sans` with `tabular-nums`, add explicit font classes |
| `src/index.css` | Add `tabular-nums` utility class |

## Technical Details

The `font-variant-numeric: tabular-nums` CSS property ensures:
- All digits have equal width (monospaced numbers)
- Consistent alignment in columns and data displays
- Professional appearance for metrics and statistics

## Expected Result

- All StatCard numbers display uniformly in Inter font
- Numbers align consistently (2, 3, 4, 5, 8 all same width)
- Description and trend text match the rest of the UI
- Clear visual hierarchy: serif for headings, sans-serif for data
