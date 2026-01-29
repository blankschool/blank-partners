
# Admin Page Implementation

## Overview

Create a centralized Admin page at `/admin` that allows administrators to manage three core resources: Clients, Team Members, and Users. The page will use tabs for easy navigation between sections and will only be accessible to users with admin role.

## Current Architecture

The project already has:
- Role-based access via `useCurrentUserRole()` hook and `is_admin()` RLS function
- Existing hooks: `useUsers()`, `useTeamMembers()`, `useClients()` with CRUD operations
- Tables: `clients`, `team_members`, `profiles`, `user_roles`
- RLS policies protecting all admin operations

## Implementation Plan

### Phase 1: Admin Route Protection

**File: `src/components/AdminRoute.tsx`**

Create a wrapper component that:
- Extends ProtectedRoute functionality
- Checks if the logged-in user is an admin using `useCurrentUserRole()`
- Redirects non-admin users to the dashboard with a toast notification

### Phase 2: Admin Page with Tabs

**File: `src/pages/Admin.tsx`**

Create the main admin page with:
- Header with admin icon and title "Administração"
- Tab navigation with three sections: Clientes, Equipe, Usuários
- Each tab contains management functionality

### Phase 3: Client Management Tab

**File: `src/components/admin/ClientsTab.tsx`**

Features:
- List all 54 clients with search/filter
- Add new client dialog (name field)
- Edit client name
- Delete client (with confirmation)
- Display member count per client

### Phase 4: Team Management Tab

**File: `src/components/admin/TeamTab.tsx`**

Features:
- List all 39 team members with filters (area, seniority)
- Add new team member dialog (full form)
- Edit team member (all fields including clients)
- Delete team member (with confirmation)
- Assign/unassign clients

### Phase 5: Users Management Tab

**File: `src/components/admin/UsersTab.tsx`**

Features:
- List all profiles with search
- Edit user (name, position, team)
- Toggle admin role
- Delete user profile

### Phase 6: Support Components

Create dialogs for CRUD operations:

| Component | Purpose |
|-----------|---------|
| `AddClientDialog.tsx` | Form to create new client |
| `EditClientDialog.tsx` | Form to edit client name |
| `AddTeamMemberDialog.tsx` | Full form for new team member |
| `EditTeamMemberDialog.tsx` | Edit existing team member |
| `DeleteConfirmDialog.tsx` | Reusable confirmation dialog |

### Phase 7: Update Hooks for Admin Operations

**File: `src/hooks/useClients.tsx`**

Add mutations:
- `createClient(name)` - insert into clients table
- `updateClient(id, name)` - update client name
- `deleteClient(id)` - remove client (cascade removes assignments)

### Phase 8: Navigation & Routing

**File: `src/App.tsx`**
- Add new route: `/admin` with AdminRoute wrapper

**File: `src/components/layout/AppSidebar.tsx`**
- Add conditional "Admin" menu item (only visible to admins)
- Use Shield icon from lucide-react

## File Structure

```text
src/
├── components/
│   ├── AdminRoute.tsx (new)
│   └── admin/
│       ├── ClientsTab.tsx (new)
│       ├── TeamTab.tsx (new)
│       ├── UsersTab.tsx (new)
│       ├── AddClientDialog.tsx (new)
│       ├── EditClientDialog.tsx (new)
│       ├── AddTeamMemberDialog.tsx (new)
│       ├── EditTeamMemberDialog.tsx (new)
│       └── DeleteConfirmDialog.tsx (new)
├── pages/
│   └── Admin.tsx (new)
└── hooks/
    └── useClients.tsx (modify - add mutations)
```

## UI Layout

```text
┌─────────────────────────────────────────────────────────────┐
│  ● Administração                                            │
│  Gerenciar clientes, equipe e usuários                     │
├─────────────────────────────────────────────────────────────┤
│  [ Clientes ]  [ Equipe ]  [ Usuários ]     + Adicionar     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Search bar...                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────┐ ┌─────────────────────┐           │
│  │ Item 1          ... │ │ Item 2          ... │           │
│  │ Details             │ │ Details             │           │
│  └─────────────────────┘ └─────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations

- AdminRoute checks `is_admin()` before rendering
- All mutations are protected by RLS policies requiring admin role
- Non-admins cannot see the Admin link in the sidebar
- Attempting to access `/admin` directly redirects to dashboard

## Technical Notes

1. Reuse existing `EditUserDialog` component for user management
2. Create new dialogs following the same pattern for clients/team
3. Use existing `useTeamMembers()` mutations for team CRUD
4. Add client mutations to `useClients()` hook
5. Use shadcn Tabs component for section navigation
6. Follow existing Portuguese translations for UI text
