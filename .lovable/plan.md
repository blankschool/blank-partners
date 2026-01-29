
# Fix Users Page Design - Match Dashboard Template

## Problems Identified

Looking at the screenshot and comparing with the Dashboard, the Users page stats cards have several design inconsistencies:

| Issue | Current (Users Page) | Expected (StatCard Template) |
|-------|---------------------|------------------------------|
| Icon Container | Colored backgrounds (`bg-primary/10`, `bg-success/10`) | Neutral `bg-secondary` with hover animation |
| Number Size | `text-2xl font-semibold` | `font-serif text-5xl font-normal tracking-tight` |
| Label Style | `text-sm` below number | `text-[10px] uppercase tracking-widest` above number |
| Layout | Icon on left, content on right | Content on left, icon on right |

---

## Solution

Refactor the Users page to use the existing `StatCard` component from the Dashboard, ensuring visual consistency across the application.

---

## Changes Required

### File: `src/pages/Users.tsx`

**Current Implementation (Lines 96-153):**
```tsx
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <UsersIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-foreground">{stats.totalUsers}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
      </div>
    </CardContent>
  </Card>
  ...
</div>
```

**Updated Implementation:**
```tsx
import { StatCard } from "@/components/dashboard/StatCard";

<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    title="Total Users"
    value={stats.totalUsers}
    icon={UsersIcon}
  />
  <StatCard
    title="Admins"
    value={stats.admins}
    icon={Shield}
  />
  <StatCard
    title="Teams"
    value={stats.teamsCount}
    icon={Building2}
  />
  <StatCard
    title="New (30 days)"
    value={stats.recentUsers}
    icon={UserPlus}
  />
</div>
```

---

## Benefits

1. **Consistency**: Uses the same design language as the Dashboard
2. **Maintainability**: Single source of truth for stat card styling
3. **Correct Typography**: Large serif numbers with tiny uppercase labels (matches project style guide)
4. **Proper Icon Styling**: Neutral background with hover animation effect

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Users.tsx` | Import and use `StatCard` component instead of custom card markup |

---

## Visual Result

After this change, the Users page stats will display:
- Large serif numbers (like "24" on Dashboard)
- Tiny uppercase labels above the numbers
- Icons in rounded containers on the right side
- Hover animation that changes icon background to accent color
