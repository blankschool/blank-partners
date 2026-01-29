
# Typography and Default View Fixes for Contents Page

## Overview
Apply the project's typography standards to the Contents page and change the default view to calendar.

## Changes Required

### 1. StageStatsPanel.tsx - Fix Numbers and Labels Typography

**Numbers (metrics)**
- Add `font-serif` class to display numbers in DM Serif Display
- Current: `text-2xl font-semibold`
- Updated: `text-2xl font-serif`

**Labels**
- Add uppercase and tracking-widest for the tiny label style
- Current: `text-xs text-muted-foreground`
- Updated: `text-[10px] uppercase tracking-widest text-muted-foreground`

### 2. Contents.tsx - Change Default View to Calendar

**viewMode initial state**
- Current: `useState<ViewMode>("grid")`
- Updated: `useState<ViewMode>("calendar")`

### 3. ContentFilters.tsx - Ensure Sans-Serif Typography

**Add explicit font-sans** to filter labels and select triggers for consistency with the Inter font family used for body/UI text.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/contents/StageStatsPanel.tsx` | Apply `font-serif` to numbers, `uppercase tracking-widest` to labels |
| `src/pages/Contents.tsx` | Change default `viewMode` from `"grid"` to `"calendar"` |
| `src/components/contents/ContentFilters.tsx` | Add `font-sans` to select triggers and filter text |

## Technical Details

```text
StageStatsPanel.tsx changes:
+------------------------------------------+
| Numbers: text-2xl font-serif             |
| Labels:  text-[10px] uppercase           |
|          tracking-widest                 |
+------------------------------------------+

Contents.tsx changes:
+------------------------------------------+
| viewMode: useState("calendar")           |
+------------------------------------------+

ContentFilters.tsx changes:
+------------------------------------------+
| SelectTrigger: font-sans                 |
| Button labels: font-sans                 |
+------------------------------------------+
```

## Expected Result
- Stage stat numbers display in DM Serif Display font
- Stage labels appear as tiny uppercase text with wide letter spacing
- Calendar view loads by default when visiting the Contents page
- All filter elements use consistent Inter font
