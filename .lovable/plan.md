
# Fix Users Page Design - Match Dashboard Template

## Problems Identified

Comparing the Users page with the Dashboard template, several design elements don't match the project's design system:

| Element | Current (Users Page) | Expected (Template) |
|---------|---------------------|---------------------|
| Page Title | `text-3xl font-semibold` | `font-serif text-3xl font-normal` with accent dot + label above |
| Section Labels | Missing | Orange dot + `text-[10px] uppercase tracking-widest` |
| Empty State Card | `border-border/50 bg-card/50` | `rounded-2xl bg-card border border-border shadow-sm` |
| Empty State Title | `text-lg font-medium` | `font-serif text-2xl font-normal` |
| Icon Container | Plain icon | Icon in `rounded-2xl bg-secondary` container |

---

## Solution

Update the Users page to follow the Dashboard's design patterns:

1. Add accent dot + uppercase label pattern for page header
2. Add section labels before stats and users grid
3. Update empty state styling to match card template
4. Use serif font for titles

---

## Changes Required

### File: `src/pages/Users.tsx`

**Header Section (Lines 78-84)**

Current:
```tsx
<h1 className="text-3xl font-semibold text-foreground">Users</h1>
<p className="text-muted-foreground mt-1">
  Manage team members and their roles
</p>
```

Updated:
```tsx
<div className="flex items-center gap-2 mb-3">
  <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Team Management</span>
</div>
<h1 className="font-serif text-3xl font-normal text-foreground">Users</h1>
<p className="mt-2 text-sm text-muted-foreground">
  Manage team members and their roles
</p>
```

**Stats Section (Lines 97-119)**

Add section label before stats:
```tsx
{/* Stats */}
<div>
  <div className="flex items-center gap-2 mb-4">
    <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Overview</span>
  </div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    ...StatCards
  </div>
</div>
```

**Empty State Card (Lines 122-131)**

Current:
```tsx
<Card className="border-border/50 bg-card/50 backdrop-blur-sm">
  <CardContent className="flex flex-col items-center justify-center py-16">
    <UsersIcon className="h-12 w-12 text-muted-foreground/50" />
    <p className="mt-4 text-lg font-medium text-foreground">No users found</p>
    <p className="text-sm text-muted-foreground">...</p>
  </CardContent>
</Card>
```

Updated:
```tsx
<Card className="rounded-2xl bg-card border border-border shadow-sm">
  <CardContent className="flex flex-col items-center justify-center py-16">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
      <UsersIcon className="h-8 w-8 text-muted-foreground" />
    </div>
    <p className="mt-6 font-serif text-2xl font-normal text-foreground">No users found</p>
    <p className="mt-2 text-sm text-muted-foreground">...</p>
  </CardContent>
</Card>
```

**Users Grid Section (Lines 132-144)**

Add section label before users grid:
```tsx
<div>
  <div className="flex items-center gap-2 mb-4">
    <span className="flex h-2 w-2 rounded-full bg-accent-orange" />
    <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Team Members</span>
  </div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    ...UserCards
  </div>
</div>
```

---

## Visual Result

After this change, the Users page will have:
- Orange accent dot with uppercase "TEAM MANAGEMENT" label above page title
- Serif font for the "Users" heading
- "OVERVIEW" section label before stats cards
- "TEAM MEMBERS" section label before users grid
- Properly styled empty state with:
  - Icon in a rounded secondary background container
  - Serif font for the title
  - Consistent spacing and shadows

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Users.tsx` | Update header, add section labels, fix empty state styling |
