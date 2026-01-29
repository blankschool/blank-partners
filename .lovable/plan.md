
# Design Refinement Plan - Matching Giga AI Reference

## Overview
Refine the ERP panel elements to precisely match the Giga AI reference design, focusing on dark card styling, status indicators with colored dots, pill-shaped tabs with icons, table styling, and refined stat displays.

---

## Analysis of Reference Screenshots

### Key Design Patterns Identified

**1. Dark Cards/Modals**
- Rich dark gray background (not pure black): `oklch(0.12-0.15 0 0)`
- Large border-radius: 20-24px
- Subtle lighter border for definition
- Internal sections with even lighter gray backgrounds

**2. Stats Display**
- Large serif numbers (60-80px equivalent)
- Small uppercase labels above the numbers
- Muted description text below
- Cards with subtle inner padding and rounded corners

**3. Status Indicators (Table)**
- Colored dots (green = passed, yellow/amber = deviated) instead of badges
- Clean table with subtle row separators (not full borders)
- Header row with slightly darker background
- Simple text-based status with dot prefix

**4. Tabs/Navigation**
- Pill-shaped active state with dark background
- Icon + text combination
- Orange accent on active icon
- Smooth rounded container

**5. Primary Buttons**
- White/light background with dark text
- Fully pill-shaped (rounded-full)
- Clean, minimal design

---

## Files to Modify

### 1. src/index.css
**Changes:**
- Add new muted card background variable for inner sections
- Fine-tune dark mode card colors to match reference (slightly lighter gray)
- Add status dot color variables (passed = green, deviated = amber)

### 2. src/components/ui/card.tsx
**No changes needed** - Already has rounded-2xl and proper styling

### 3. src/components/ui/tabs.tsx
**Changes:**
- Update TabsList to have rounded-xl with dark background in dark mode
- Update TabsTrigger to be pill-shaped with icon support
- Add smooth transitions
- Active state: filled background with orange icon tint

### 4. src/components/ui/table.tsx
**Changes:**
- Update TableHeader to have rounded corners and subtle dark background
- Refine row separators to be more subtle
- Add hover states

### 5. src/components/ui/progress.tsx
**Changes:**
- Update indicator color to use accent-orange for better visual consistency
- Ensure proper dark mode styling

### 6. src/pages/Healthscore.tsx
**Major Redesign:**
- Create stat cards matching reference (large serif number, uppercase label, description)
- Replace badges with colored dot status indicators
- Add a clean table view for test cases/metrics
- Use the reference "Test results" card layout

### 7. src/pages/Dashboard.tsx
**Changes:**
- Ensure stat cards use serif numbers prominently
- Refine section styling

### 8. src/components/dashboard/StatCard.tsx
**Changes:**
- Increase number size for more impact
- Ensure uppercase labels
- Add description support below numbers

### 9. src/components/layout/AppSidebar.tsx
**Changes:**
- Refine navigation item active state with orange icon tint
- Update logo to use gradient/colorful style like reference
- Adjust spacing and padding

### 10. src/pages/Contents.tsx
**Changes:**
- Update tabs to match new pill-style with icons
- Refine view toggle buttons

---

## Technical Implementation Details

### New CSS Variables

```css
:root {
  /* Inner card sections (slightly darker than card) */
  --card-muted: oklch(0.9400 0 0);
  
  /* Status dot colors */
  --status-passed: oklch(0.6500 0.1800 145);
  --status-deviated: oklch(0.7500 0.1500 85);
  --status-failed: oklch(0.5379 0.2186 25.9751);
}

.dark {
  --card: oklch(0.1200 0 0); /* Slightly lighter for cards */
  --card-muted: oklch(0.1500 0 0); /* Inner sections */
}
```

### Updated Tabs Component

```tsx
const TabsList = (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-12 items-center gap-1 rounded-xl bg-muted p-1.5",
      className
    )}
  />
);

const TabsTrigger = (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium",
      "transition-all duration-300",
      "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
      "data-[state=active]:shadow-sm",
      className
    )}
  />
);
```

### Healthscore Page Redesign

New structure:
1. **Stats Row** - Three cards with:
   - Uppercase label (e.g., "PASS RATE")
   - Large serif number (e.g., "99%")
   - Muted description

2. **Test Results Table**:
   - Rounded card container
   - Header with slightly darker background
   - Rows with:
     - Test case name
     - Status with colored dot (Passed/Deviated)
     - Pass rate percentage

### Status Dot Component

```tsx
function StatusDot({ status }: { status: "passed" | "deviated" | "failed" }) {
  const colors = {
    passed: "bg-success",
    deviated: "bg-warning",
    failed: "bg-destructive"
  };
  
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", colors[status])} />
      <span className="capitalize">{status === "deviated" ? "Deviated" : status}</span>
    </span>
  );
}
```

---

## Visual Changes Summary

| Element | Current | Updated |
|---------|---------|---------|
| Tabs | Rounded-sm, minimal | Pill-shaped, icon + text, filled active |
| Status indicators | Badge component | Colored dot + text |
| Stat numbers | text-3xl | text-5xl to text-6xl serif |
| Stat labels | text-sm | text-xs uppercase tracking-widest |
| Table header | Default | Rounded corners, darker bg |
| Card inner sections | Same as card | Slightly different shade |
| Dark mode cards | oklch(0.08) | oklch(0.12) - lighter gray |

---

## Implementation Order

1. Update CSS variables in index.css
2. Modify tabs.tsx for pill-shaped style
3. Update table.tsx with refined styling
4. Enhance StatCard component
5. Redesign Healthscore page with reference layout
6. Update Contents page tabs with icons
7. Refine AppSidebar active states
8. Test across all pages in light and dark modes
