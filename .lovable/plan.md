
# Convert Team and Users Tabs to List Layout

## Overview

Convert the Team (Equipe) and Users (Usuários) tabs from card grid layouts to compact, table-like list layouts, matching the optimized Clients tab design.

## Current State

Both tabs use a 3-column card grid that takes significant vertical space:
- **TeamTab**: Shows 39 team members with name, email, area, seniority, position, start date, and clients
- **UsersTab**: Shows users with name, email, team, position, and admin status

## New List Layout Design

### TeamTab Columns
| Avatar | Nome | Email | Área | Senioridade | Cargo | Ações |

### UsersTab Columns
| Avatar | Nome | Email | Equipe | Cargo | Tipo | Ações |

## Technical Changes

### File: `src/components/admin/TeamTab.tsx`

**Replace grid layout (lines 130-210) with:**
- Rounded container with header row and dividers
- Header: Avatar space, Nome, Email, Área, Senioridade, Cargo, Ações
- Each member as a single row with:
  - Compact avatar (h-8 w-8)
  - Name (font-medium, truncate)
  - Email (hidden on mobile, text-muted-foreground)
  - Area badge (hidden on small screens)
  - Seniority badge (hidden on small screens)
  - Position text (hidden on medium screens)
  - Edit/Delete buttons (opacity on hover)

**Responsive behavior:**
- Mobile: Avatar, Name, Actions only
- Tablet: Add Email
- Desktop: Show all columns

### File: `src/components/admin/UsersTab.tsx`

**Replace grid layout (lines 80-158) with:**
- Same container style as TeamTab
- Header: Avatar space, Nome, Email, Equipe, Cargo, Tipo, Ações
- Each user as a single row with:
  - Avatar with image support
  - Name with admin shield icon inline
  - Email (hidden on mobile)
  - Team badge (hidden on small screens)
  - Position text (hidden on medium screens)
  - Admin/User badge
  - Edit/Delete buttons (opacity on hover)

## Visual Comparison

### Before (Card Grid)
```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Avatar]     │ │ [Avatar]     │ │ [Avatar]     │
│ Name         │ │ Name         │ │ Name         │
│ email@...    │ │ email@...    │ │ email@...    │
│ [Area][Sen]  │ │ [Area][Sen]  │ │ [Area][Sen]  │
│ Start: Date  │ │ Start: Date  │ │ Start: Date  │
└──────────────┘ └──────────────┘ └──────────────┘
```

### After (List)
```text
┌──────────────────────────────────────────────────────────────────┐
│      Nome           Email              Área    Senior.   Ações   │
├──────────────────────────────────────────────────────────────────┤
│ [AV] João Silva     joao@email.com     Design  Pleno     [✎][🗑] │
│ [MA] Maria Santos   maria@email.com    Dev     Senior    [✎][🗑] │
│ [PE] Pedro Costa    pedro@email.com    Growth  Junior    [✎][🗑] │
└──────────────────────────────────────────────────────────────────┘
```

## Benefits

1. **Space Efficiency**: Display 15+ members per screen vs 6-9 with cards
2. **Faster Scanning**: Horizontal alignment enables quick comparison
3. **Consistent Design**: Matches the optimized Clients tab
4. **Better for Admin Tasks**: Quick access to edit/delete across many records

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/TeamTab.tsx` | Replace grid with list layout |
| `src/components/admin/UsersTab.tsx` | Replace grid with list layout |

## Implementation Details

### List Container Structure
```tsx
<div className="rounded-xl border border-border bg-card overflow-hidden">
  {/* Header row */}
  <div className="flex items-center gap-4 px-4 py-3 text-xs font-medium 
                  text-muted-foreground uppercase tracking-wider 
                  border-b border-border bg-muted/30">
    <span className="w-8"></span>
    <span className="flex-1 min-w-0">Nome</span>
    <span className="w-48 hidden sm:block">Email</span>
    <span className="w-24 hidden md:block">Área</span>
    <span className="w-20 hidden lg:block">Senioridade</span>
    <span className="w-20 text-right">Ações</span>
  </div>
  
  {/* List items */}
  <div className="divide-y divide-border">
    {filteredMembers.map((member) => (
      <div className="group flex items-center gap-4 px-4 py-3 
                      transition-colors hover:bg-muted/50">
        {/* Row content */}
      </div>
    ))}
  </div>
</div>
```

### Badge Styling
Keep existing badge styles but make them more compact:
- Area/Team: `variant="secondary"` with smaller text
- Seniority/Position: `variant="outline"`
- Admin status: Keep the primary colored badge for visibility
