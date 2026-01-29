
# Complete Typography Fix for Contents Page Filters

## Issue
The filters on the Contents page are still not displaying the correct Inter typography consistently across all elements.

## Root Cause Analysis
While the body uses Inter as the default font and `font-sans` was added to SelectTrigger elements and the period button, other filter elements are missing the explicit font class:
- Buttons inside the period popover (Tudo, Semana, Mes)
- Search input field
- SelectContent and SelectItem elements

## Changes Required

### 1. ContentFilters.tsx - Complete Font Coverage

| Element | Current | Change |
|---------|---------|--------|
| Period popover buttons (lines 149-177) | No font-sans | Add `font-sans` class |
| Search Input (line 201-206) | No font-sans | Add `font-sans` class |

### 2. UI Component Updates for Global Consistency

To ensure all Select dropdowns across the app use the correct font, update the base components:

| Component | Change |
|-----------|--------|
| `src/components/ui/select.tsx` | Add `font-sans` to SelectContent and SelectItem |
| `src/components/ui/input.tsx` | Add `font-sans` to Input base class |
| `src/components/ui/button.tsx` | Add `font-sans` to buttonVariants base class |

## Technical Details

```text
ContentFilters.tsx:
- Line 149-177: Add font-sans to period picker buttons
- Line 201: Add font-sans to search Input

select.tsx:
- SelectContent: Add font-sans to className
- SelectItem: Add font-sans to className  

input.tsx:
- Add font-sans to base className string

button.tsx:
- Add font-sans to cva base class string
```

## Expected Result
- All filter elements (dropdowns, buttons, input) display in Inter font
- Consistent typography across the entire Contents page
- Global UI components updated to prevent similar issues elsewhere
